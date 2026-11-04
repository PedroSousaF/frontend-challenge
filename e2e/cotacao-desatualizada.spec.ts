import { expect, test, type Page } from '@playwright/test'

// Conta as chamadas de criação de Pedido que saem do app (respondidas pelo MSW).
function contarPedidos(page: Page) {
  const contagem = { total: 0 }
  page.on('request', (r) => {
    if (r.method() === 'POST' && new URL(r.url()).pathname === '/api/pedidos') contagem.total++
  })
  return contagem
}

test.describe('Cotação desatualizada na confirmação da compra', () => {
  test('preço mudou entre o carrinho e a confirmação', async ({ page }) => {
    const pedidos = contarPedidos(page)
    // Dado um carrinho com um NFT cotado a 0,50 ETH
    await page.goto('/?cenario=preco-alterado')
    await expect(page.getByRole('listitem').filter({ hasText: 'Aurora #1' })).toContainText('0,50 ETH')

    // E a cotação atual desse NFT é 0,55 ETH / Quando o colecionador confirma a compra
    await page.getByRole('button', { name: 'Confirmar compra' }).click()

    // Então nenhum Pedido é criado
    const aviso = page.getByRole('alert')
    await expect(aviso).toContainText('Preço de Aurora #1: 0,50 ETH → 0,55 ETH')
    expect(pedidos.total).toBe(0)
    await expect(page.getByRole('heading', { name: /Recibo/ })).toHaveCount(0)
    // E pede que ele aceite a nova cotação (a confirmação fica bloqueada até lá)
    await expect(aviso.getByRole('button', { name: 'Aceitar nova cotação' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled()
  })

  test('colecionador aceita a nova cotação', async ({ page }) => {
    // Dado que a confirmação foi bloqueada porque o preço mudou para 0,55 ETH
    await page.goto('/?cenario=preco-alterado')
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await expect(page.getByRole('alert')).toContainText('0,50 ETH → 0,55 ETH')

    // Quando o colecionador aceita a nova cotação e confirma
    await page.getByRole('button', { name: 'Aceitar nova cotação' }).click()
    const totalAceito = await page.getByTestId('total').textContent()
    expect(totalAceito).toBe('0,56 ETH')
    await page.getByRole('button', { name: 'Confirmar compra' }).click()

    // Então o Pedido é criado com o preço de 0,55 ETH
    await expect(page.getByRole('heading', { name: /Recibo do pedido/ })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'Aurora #1' })).toContainText('0,55 ETH')
    // E o recibo mostra exatamente o total que ele aceitou
    await expect(page.getByTestId('total')).toHaveText(totalAceito!)
  })

  test('edição esgotada no momento de confirmar', async ({ page }) => {
    const pedidos = contarPedidos(page)
    // Dado um carrinho com dois NFTs
    await page.goto('/?cenario=edicao-esgotada')
    const carrinho = page.getByRole('region', { name: 'Carrinho' })
    await expect(carrinho.getByRole('listitem')).toHaveCount(2)

    // E a edição de um deles esgotou / Quando o colecionador confirma a compra
    await page.getByRole('button', { name: 'Confirmar compra' }).click()

    // Então nenhum Pedido é criado
    const aviso = page.getByRole('alert')
    await expect(aviso).toContainText('Esgotou: Nebula #7 (Prata)')
    expect(pedidos.total).toBe(0)
    await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled()
    // E a tela indica qual item esgotou e o outro item continua no carrinho
    await expect(carrinho.getByRole('listitem').filter({ hasText: 'Nebula #7' })).toContainText('Esgotada')
    await expect(carrinho.getByRole('listitem').filter({ hasText: 'Aurora #1' })).toBeVisible()
    await expect(carrinho.getByRole('listitem').filter({ hasText: 'Aurora #1' })).not.toContainText('Esgotada')
  })
})
