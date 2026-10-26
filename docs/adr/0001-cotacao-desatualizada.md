# ADR-0001: Revalidar a cotação ao confirmar e exigir aceite explícito quando ela mudar

## Status

Proposta. Depende de validar com colecionador real as perguntas em aberto do `RESEARCH.md`.

## Contexto

O colecionador monta o carrinho e, até confirmar a compra, o preço ou a disponibilidade
podem mudar, porque vêm do Catálogo. Hoje ele pode confirmar com uma cotação desatualizada
e só descobrir no recibo ("vi 0,50 ETH, o recibo veio com outro valor e ninguém me avisou")
ou nunca descobrir. O README trata "preço alterado ou edição esgotada durante a compra" como
cenário central e diz que uma cotação desatualizada não deve passar. Mexe com dinheiro em ETH,
onde o total mostrado precisa ser exatamente o total cobrado. Não há dado real de frequência
nem de valor perdido.

## Decisão

No contexto Compra, ao confirmar, vamos pedir uma nova cotação e compará-la com a que o
colecionador está vendo (preço, disponibilidade, cupom e taxas). Se houver qualquer diferença,
o Pedido não é criado: mostramos o que mudou e só seguimos depois que ele aceitar a nova cotação.
O Pedido sempre carrega os valores da cotação que o colecionador viu e aceitou.

## Alternativas consideradas

- **Travar o preço no momento em que o item entra no carrinho:** descartada. O preço e a
  disponibilidade são do Catálogo, não da Compra, e o README espera que a mudança seja percebida, não escondida.
- **Aceitar automaticamente variações pequenas:** descartada por enquanto. Não sabemos se o
  colecionador acompanha o mercado ou espera preço fixo (pergunta em aberto 1), então qualquer limite seria inventado.
- **Só avisar no recibo:** descartada. É exatamente a dor ("perceber tarde demais").

## Consequências

**Positivas:**
- O colecionador nunca paga um valor diferente do que aceitou sem ter sido avisado.
- O recibo passa a reproduzir sempre a cotação aceita, o que tira a dúvida sobre "valor mostrado vs. cobrado".

**Negativas / trade-offs:**
- Confirmar fica um passo mais lento: há uma nova cotação antes de criar o Pedido.
- Quando o preço muda, o colecionador precisa clicar de novo; se isso for frequente, pode irritar (não medido).
- Quando a edição esgota, ele ainda precisa remover o item e refazer parte do carrinho; esta decisão avisa, mas não resolve essa perda de tempo.
- Se a nova cotação não puder ser obtida, a compra não é confirmada: preferimos não vender a vender com valor errado.
