# Cotação desatualizada na confirmação da compra — spec

**Bounded context (semana 5):** Compra (`src/compra/`)
**ADR relacionada:** [`docs/adr/0001-cotacao-desatualizada.md`](adr/0001-cotacao-desatualizada.md)
**Escala:** M. A atividade das semanas 5–6 classifica este problema como M. O agente do Plan tinha posto G por mexer com dinheiro; revisei para M porque o escopo é um passo do checkout num contexto só, e a ADR já cobre o risco.

## Contexto

O colecionador monta um carrinho (NFT, edição, quantidade) e, até confirmar, o preço ou a
disponibilidade podem mudar no Catálogo. Hoje ele pode confirmar com uma cotação velha:
"Eu vi 0,50 ETH no carrinho, cliquei em pagar e o recibo veio com outro valor. Ninguém me
avisou." A dor é perceber tarde demais, só no recibo, ou não perceber nada. O README espera
que ele perceba enquanto o carrinho está aberto e, no pior caso, ao confirmar, e diz que uma
cotação desatualizada não deve passar. Quatro coisas podem mudar: preço, disponibilidade,
cupom e taxas. Não há dado real de frequência nem de valor perdido. Isso ainda é hipótese.

## Decisão

Ao confirmar, a Compra pede uma nova cotação e a compara com a que está na tela. Se nada
mudou, cria o Pedido. Se algo mudou, não cria o Pedido, mostra ao colecionador o que mudou
(antes → depois) e só segue depois que ele aceitar a nova cotação. O Pedido e o recibo
reproduzem exatamente o total da cotação aceita.

## Fora de escopo

- Atualização em tempo real do carrinho, sem ação do colecionador.
- Aceitar sozinho variações "pequenas" de preço: não sabemos se o colecionador espera preço fixo (pergunta em aberto 1).
- Reservar a edição ou travar o preço enquanto o item está no carrinho.
- Sugerir outro NFT ou outra edição quando a edição esgota.
- Avisar suporte ou vendedor: não sabemos se eles sentem a dor (pergunta em aberto 5).
- Medir frequência e valor das mudanças: isso é validação da pesquisa, não desta feature.

## Critérios (EARS)

1. **Ubíqua:** A Compra deve criar o Pedido somente com os valores da cotação que o
   colecionador viu e aceitou, e o recibo deve reproduzir esse total sem nenhuma diferença
   de arredondamento em ETH.
   > Origem: RESEARCH "O que mais incomoda é pagar um valor diferente do que aceitou sem ter sido avisado" · README §3 › Carrinho ("manter precisão nos cálculos e na apresentação") e §3 › Pagamento e confirmação ("O recibo deve reproduzir o snapshot do pedido").
2. **Orientada a evento:** Quando o colecionador confirmar a compra, a Compra deve obter uma
   nova cotação e compará-la com a exibida (preço, disponibilidade, cupom e taxas) antes de
   criar o Pedido.
   > Origem: RESEARCH "Uma cotação desatualizada não deve passar" · README §3 › Pagamento e confirmação ("Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra") e §7, passo 4.
3. **Orientada a estado:** Enquanto a nova cotação divergir da exibida e o colecionador não
   a tiver aceitado, a Compra deve mostrar cada valor que mudou (antes → depois) e manter a
   confirmação bloqueada.
   > Origem: RESEARCH "A dor é perceber tarde demais, ou seja, só no recibo, ou não perceber nada" · README §3 › Pagamento e confirmação ("Mudanças devem exigir nova confirmação do usuário") e §7, passo 3 ("A interface informa a alteração e atualiza o resumo").
4. **Feature opcional:** Onde o carrinho tiver cupom aplicado, a Compra deve avisar o
   colecionador, antes de criar o Pedido, se a nova cotação indicar o cupom como inválido ou
   expirado, e exigir que ele confirme de novo com a cotação atualizada.
   > Origem: RESEARCH "Os quatro itens que podem mudar são preço, disponibilidade, cupom (inválido ou expirado) e taxas" · README §3 › Carrinho ("tratamento de código inválido ou expirado") e §3 › Pagamento e confirmação ("Mudanças devem exigir nova confirmação do usuário").
   > Revisão: o agente tinha escrito "mostrando o total sem o desconto". Cortei: nem o RESEARCH nem o README dizem o que acontece com o desconto.
5. **Comportamento indesejado:** Se a nova cotação indicar uma edição esgotada, então a
   Compra deve impedir a criação do Pedido, indicar qual item esgotou e manter os demais
   itens no carrinho.
   > Origem: RESEARCH "Tempo perdido quando a edição esgota no fim: precisa voltar ao catálogo e montar o carrinho de novo" · README §3 › Pagamento e confirmação ("Preservar os itens em falhas") e §6 ("preço alterado ou edição esgotada durante a compra").

## Cenários (BDD)

```gherkin
Cenário: preço mudou entre o carrinho e a confirmação
Dado um carrinho com um NFT cotado a 0,50 ETH
E a cotação atual desse NFT é 0,55 ETH
Quando o colecionador confirma a compra
Então nenhum Pedido é criado
E a tela mostra o preço "0,50 ETH → 0,55 ETH" e pede que ele aceite a nova cotação
```

```gherkin
Cenário: colecionador aceita a nova cotação
Dado que a confirmação foi bloqueada porque o preço mudou para 0,55 ETH
Quando o colecionador aceita a nova cotação e confirma
Então o Pedido é criado com o preço de 0,55 ETH
E o recibo mostra exatamente o total que ele aceitou
```

```gherkin
Cenário: edição esgotada no momento de confirmar
Dado um carrinho com dois NFTs
E a edição de um deles esgotou depois que ele entrou no carrinho
Quando o colecionador confirma a compra
Então nenhum Pedido é criado
E a tela indica qual item esgotou e o outro item continua no carrinho
```

## Como eu vou saber que funcionou

Os 3 cenários acima, automatizados com um runner de BDD na semana 8, passam. Os critérios
1–5 têm pelo menos um teste cada (o 4, cupom, e o 1, arredondamento, ainda sem cenário acima).

## Linguagem ubíqua usada aqui

| Termo | O que significa neste projeto |
|---|---|
| Carrinho | Itens (NFT + edição + quantidade inteira) que o colecionador pretende comprar; sobrevive a refresh e é preservado no login. |
| Cotação | Resposta da API com disponibilidade, cupom, desconto, taxas e total; é a referência para finalizar o pedido. |
| Pedido | Compra enviada, criada com chave de idempotência; pendente, confirmado ou recusado (os dois últimos são terminais). |
| Preço | Na Compra, o valor fixado na cotação e depois no snapshot do pedido, que o recibo reproduz. |
| Colecionador | Quem monta o carrinho e confirma a compra; quem sente a dor. |
