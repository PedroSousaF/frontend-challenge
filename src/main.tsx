import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupWorker } from 'msw/browser'
import { Checkout } from './compra/Checkout'
import { criarHandlers, type Cenario } from './compra/mocks'

const cenario = (new URLSearchParams(location.search).get('cenario') ?? 'padrao') as Cenario
await setupWorker(...criarHandlers(cenario)).start()

// Sem retry nem refetch automático: uma nova cotação só é pedida quando o colecionador confirma.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false }, mutations: { retry: false } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Checkout />
    </QueryClientProvider>
  </StrictMode>,
)
