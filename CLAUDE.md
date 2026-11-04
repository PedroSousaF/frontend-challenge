# frontend-challenge

Enunciado: README.md. Glossário do domínio abaixo (copiado de GLOSSARIO.md).

## Glossário: Marketplace de NFTs (Desafio Frontend)

Tirado do `README.md` do desafio. Entre parênteses, a seção de onde veio cada definição.

### Contexto 1: Catálogo (pasta: src/catalogo/)

Onde o colecionador descobre NFTs: início, busca e detalhe.

- **NFT**: item à venda no marketplace, com galeria, informações, edições e favoritos; acessível direto pela URL do detalhe (§3 tabela, §3 › Catálogo e detalhe).
- **Edição**: uma das tiragens de um NFT, com disponibilidade própria; pode estar indisponível e limita a quantidade que se pode escolher (§3 › Catálogo e detalhe, §3 › Carrinho).
- **Busca**: o conjunto termo + filtros combináveis + ordenação + página que define a listagem; mora na URL e sobrevive a refresh e ao histórico; mudar um filtro volta para a página 1 (§3 › Catálogo e detalhe).

### Contexto 2: Compra (pasta: src/compra/)

Do carrinho ao recibo: o que o colecionador vai pagar e o que efetivamente comprou.

- **Carrinho**: itens (NFT + edição + quantidade inteira) que o colecionador pretende comprar; sobrevive a refresh e é preservado quando o visitante faz login (§3 › Carrinho).
- **Cotação**: a resposta da API com disponibilidade, cupom, desconto, taxas e total; é a referência para finalizar o pedido (§3 › Carrinho, §5).
- **Pedido**: a compra enviada, criada com chave de idempotência; pode estar pendente, confirmado ou recusado, e confirmado/recusado são terminais (§3 › Pagamento e confirmação, §5, §7).

### Palavra que muda de sentido entre os dois

- **Preço**: no **Catálogo** é o valor anunciado do NFT naquele momento, que muda em tempo real e deve ser atualizado na tela (§7, evento `nft.updated`); na **Compra** é o valor fixado na cotação e depois no snapshot do pedido, que o recibo reproduz e que alterações posteriores no catálogo não podem modificar (§3 › Carrinho, §3 › Pagamento e confirmação).
