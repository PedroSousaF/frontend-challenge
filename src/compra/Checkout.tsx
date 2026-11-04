import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarPedido, pedirCotacao, type Cotacao, type Pedido } from './api'
import { eth, mudancas, type Mudanca } from './cotacao'

type Revalidacao =
  | { tipo: 'divergiu'; nova: Cotacao; lista: Mudanca[] }
  | { tipo: 'pedido'; pedido: Pedido }

export function Checkout() {
  const queryClient = useQueryClient()
  const { data: exibida, isError } = useQuery({ queryKey: ['cotacao'], queryFn: pedirCotacao, staleTime: Infinity })
  const [divergencia, setDivergencia] = useState<Extract<Revalidacao, { tipo: 'divergiu' }> | null>(null)

  const confirmar = useMutation({
    mutationFn: async (exibida: Cotacao): Promise<Revalidacao> => {
      const nova = await pedirCotacao()
      const lista = mudancas(exibida, nova)
      if (lista.length > 0 || nova.itens.some((i) => !i.disponivel)) return { tipo: 'divergiu', nova, lista }
      return { tipo: 'pedido', pedido: await criarPedido(nova.id, crypto.randomUUID()) }
    },
    onSuccess: (r) => setDivergencia(r.tipo === 'divergiu' ? r : null),
  })

  const aceitar = () => {
    if (!divergencia) return
    queryClient.setQueryData(['cotacao'], divergencia.nova)
    setDivergencia(null)
  }

  if (isError) return <p role="alert">Não foi possível obter a cotação.</p>
  if (!exibida) return <p aria-busy="true">Carregando cotação…</p>

  const pedido = confirmar.data?.tipo === 'pedido' ? confirmar.data.pedido : null
  if (pedido) return <Recibo pedido={pedido} />

  const esgotados = (divergencia?.nova ?? exibida).itens.filter((i) => !i.disponivel)

  return (
    <main>
      <h1>Pagamento</h1>
      <section aria-labelledby="carrinho">
        <h2 id="carrinho">Carrinho</h2>
        <ul>
          {exibida.itens.map((i) => (
            <li key={i.itemId}>
              {i.nome} ({i.edicao}) × {i.quantidade} — {eth(i.preco)}
              {esgotados.some((e) => e.itemId === i.itemId) && <strong> — Esgotada</strong>}
            </li>
          ))}
        </ul>
        <Resumo cotacao={exibida} />
      </section>

      {divergencia && (
        <section role="alert" aria-labelledby="mudou">
          <h2 id="mudou">A cotação mudou</h2>
          <ul>
            {divergencia.lista.map((m) => (
              <li key={m.rotulo}>
                {m.rotulo}: {m.antes} → {m.depois}
              </li>
            ))}
          </ul>
          {esgotados.length > 0 ? (
            <p>
              Esgotou: {esgotados.map((e) => `${e.nome} (${e.edicao})`).join(', ')}. O pedido não pode ser criado com
              esse item.
            </p>
          ) : (
            <button onClick={aceitar}>Aceitar nova cotação</button>
          )}
        </section>
      )}

      {confirmar.isError && (
        <p role="alert">Não foi possível revalidar a cotação. A compra não foi confirmada; tente de novo.</p>
      )}

      <button
        onClick={() => confirmar.mutate(exibida)}
        disabled={confirmar.isPending || divergencia !== null || esgotados.length > 0}
      >
        Confirmar compra
      </button>
    </main>
  )
}

function Resumo({ cotacao }: { cotacao: Omit<Cotacao, 'id'> }) {
  return (
    <dl>
      {cotacao.cupom && (
        <>
          <dt>Cupom</dt>
          <dd>{cotacao.cupom.codigo}</dd>
        </>
      )}
      <dt>Desconto</dt>
      <dd>{eth(cotacao.desconto)}</dd>
      <dt>Taxas</dt>
      <dd>{eth(cotacao.taxas)}</dd>
      <dt>Total</dt>
      <dd data-testid="total">{eth(cotacao.total)}</dd>
    </dl>
  )
}

function Recibo({ pedido }: { pedido: Pedido }) {
  return (
    <main>
      <h1>Recibo do pedido {pedido.id}</h1>
      <ul>
        {pedido.itens.map((i) => (
          <li key={i.itemId}>
            {i.nome} ({i.edicao}) × {i.quantidade} — {eth(i.preco)}
          </li>
        ))}
      </ul>
      <Resumo cotacao={pedido} />
    </main>
  )
}
