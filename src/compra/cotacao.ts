import type { Cotacao } from './api'

export type Mudanca = { rotulo: string; antes: string; depois: string }

export const eth = (valor: string) => `${valor.replace('.', ',')} ETH`

const statusCupom = { valido: 'válido', invalido: 'inválido', expirado: 'expirado' } as const

// Compara a cotação exibida com a nova: preço, disponibilidade, cupom e taxas (critério EARS 2).
export function mudancas(exibida: Cotacao, nova: Cotacao): Mudanca[] {
  const lista: Mudanca[] = []
  for (const item of nova.itens) {
    const antes = exibida.itens.find((i) => i.itemId === item.itemId)
    if (!antes) continue
    if (antes.preco !== item.preco)
      lista.push({ rotulo: `Preço de ${item.nome}`, antes: eth(antes.preco), depois: eth(item.preco) })
    if (antes.disponivel !== item.disponivel)
      lista.push({
        rotulo: `Disponibilidade de ${item.nome}`,
        antes: antes.disponivel ? 'disponível' : 'esgotada',
        depois: item.disponivel ? 'disponível' : 'esgotada',
      })
  }
  if (exibida.cupom && nova.cupom && exibida.cupom.status !== nova.cupom.status)
    lista.push({
      rotulo: `Cupom ${nova.cupom.codigo}`,
      antes: statusCupom[exibida.cupom.status],
      depois: statusCupom[nova.cupom.status],
    })
  if (exibida.desconto !== nova.desconto)
    lista.push({ rotulo: 'Desconto', antes: eth(exibida.desconto), depois: eth(nova.desconto) })
  if (exibida.taxas !== nova.taxas)
    lista.push({ rotulo: 'Taxas', antes: eth(exibida.taxas), depois: eth(nova.taxas) })
  if (exibida.total !== nova.total)
    lista.push({ rotulo: 'Total', antes: eth(exibida.total), depois: eth(nova.total) })
  return lista
}
