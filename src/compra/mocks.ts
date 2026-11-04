import { http, HttpResponse } from 'msw'
import type { Cotacao, Pedido } from './api'

export type Cenario = 'padrao' | 'preco-alterado' | 'edicao-esgotada'

// Aritmética em ETH com 18 casas via BigInt, para não perder precisão.
const CASAS = 18
const paraWei = (v: string) => {
  const [inteiro, fracao = ''] = v.split('.')
  return BigInt(inteiro + fracao.padEnd(CASAS, '0'))
}
const deWei = (w: bigint) => {
  const s = w.toString().padStart(CASAS + 1, '0')
  return `${s.slice(0, -CASAS)}.${s.slice(-CASAS).replace(/0+$/, '').padEnd(2, '0')}`
}

export function criarHandlers(cenario: Cenario) {
  const catalogo: Record<string, { nome: string; edicao: string; preco: string; estoque: number }> = {
    aurora: { nome: 'Aurora #1', edicao: 'Ouro', preco: '0.50', estoque: 5 },
    nebula: { nome: 'Nebula #7', edicao: 'Prata', preco: '0.30', estoque: 3 },
  }
  const carrinho =
    cenario === 'edicao-esgotada'
      ? [{ nftId: 'aurora', quantidade: 1 }, { nftId: 'nebula', quantidade: 1 }]
      : [{ nftId: 'aurora', quantidade: 1 }]
  const TAXA = '0.01'
  const cotacoes = new Map<string, Cotacao>()
  const pedidos = new Map<string, Pedido>()
  let numeroCotacao = 0

  return [
    http.post('/api/cotacao', () => {
      numeroCotacao++
      // shortcut: a mudança no catálogo acontece logo antes da 2ª cotação (a da confirmação),
      // simulando o que viria por nft.updated; trocar pelo evento Socket.IO quando o tempo real existir.
      if (numeroCotacao === 2 && cenario === 'preco-alterado') catalogo.aurora.preco = '0.55'
      if (numeroCotacao === 2 && cenario === 'edicao-esgotada') catalogo.nebula.estoque = 0

      const itens = carrinho.map(({ nftId, quantidade }) => {
        const nft = catalogo[nftId]
        return { itemId: nftId, nome: nft.nome, edicao: nft.edicao, quantidade, preco: nft.preco, disponivel: nft.estoque >= quantidade }
      })
      const subtotal = itens.reduce((s, i) => s + paraWei(i.preco) * BigInt(i.quantidade), 0n)
      const cotacao: Cotacao = {
        id: `cot-${numeroCotacao}`,
        itens,
        cupom: null,
        desconto: '0.00',
        taxas: TAXA,
        total: deWei(subtotal + paraWei(TAXA)),
      }
      cotacoes.set(cotacao.id, cotacao)
      return HttpResponse.json(cotacao)
    }),

    http.post('/api/pedidos', async ({ request }) => {
      const chave = request.headers.get('Idempotency-Key')
      const { cotacaoId } = (await request.json()) as { cotacaoId: string }
      if (!chave) return HttpResponse.json({ erro: 'Idempotency-Key obrigatória' }, { status: 400 })
      const existente = pedidos.get(chave)
      if (existente)
        return existente.cotacaoId === cotacaoId
          ? HttpResponse.json(existente)
          : HttpResponse.json({ erro: 'Chave reutilizada com conteúdo diferente' }, { status: 409 })
      const cotacao = cotacoes.get(cotacaoId)
      if (!cotacao) return HttpResponse.json({ erro: 'Cotação inexistente' }, { status: 404 })
      if (cotacao.itens.some((i) => !i.disponivel))
        return HttpResponse.json({ erro: 'Edição esgotada' }, { status: 409 })
      // O Pedido é um snapshot da cotação aceita: mudanças posteriores no catálogo não o alteram.
      const { id, ...valores } = structuredClone(cotacao)
      const pedido: Pedido = { ...valores, id: `ped-${pedidos.size + 1}`, cotacaoId: id }
      pedidos.set(chave, pedido)
      return HttpResponse.json(pedido, { status: 201 })
    }),
  ]
}
