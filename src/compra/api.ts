import axios from 'axios'

// Valores em ETH trafegam como strings decimais (README §3 › Carrinho); nunca viram number.
export type ItemCotado = {
  itemId: string
  nome: string
  edicao: string
  quantidade: number
  preco: string
  disponivel: boolean
}

export type Cotacao = {
  id: string
  itens: ItemCotado[]
  cupom: { codigo: string; status: 'valido' | 'invalido' | 'expirado' } | null
  desconto: string
  taxas: string
  total: string
}

export type Pedido = Omit<Cotacao, 'id'> & { id: string; cotacaoId: string }

const api = axios.create({ baseURL: '/api' })

export const pedirCotacao = () => api.post<Cotacao>('/cotacao').then((r) => r.data)

export const criarPedido = (cotacaoId: string, chaveIdempotencia: string) =>
  api
    .post<Pedido>('/pedidos', { cotacaoId }, { headers: { 'Idempotency-Key': chaveIdempotencia } })
    .then((r) => r.data)
