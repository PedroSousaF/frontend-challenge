# busca-na-url Specification

**Approved**: pendente (aguardando a aprovação do usuário)

## Problem Statement

O README (§3 › Catálogo e detalhe) exige que a Busca (termo, filtros, ordenação e página) faça parte do estado da URL, sobreviva a refresh e à navegação pelo histórico, e que mudar um filtro reinicie a paginação. Sem isso, o colecionador perde a listagem ao recarregar ou ao usar voltar/avançar, e o item 1 dos testes E2E (§9) não passa.

## Goals

- [ ] Refresh e voltar/avançar do navegador restauram a mesma URL e a mesma listagem da Busca.
- [ ] Mudar um filtro grava a nova Busca na URL com página 1.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Tudo em `src/compra/` (Carrinho, Cotação, Pedido) | Pedido do usuário: só `src/catalogo/` |
| Filtros além de categoria | Os cenários só usam categoria |
| Detalhe do NFT, favoritos, destaques | Outras features do Catálogo |
| Preço em tempo real (`nft.updated`) reordenando a listagem | Outra feature; os cenários assumem dados estáveis entre o refresh e a nova consulta |
| Estados de vazio, erro, skeleton e respostas fora de ordem da listagem | Exigidos pelo README (§3, §4), mas não fazem parte destes cenários |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Q1. Cenário 2 diz "atendem aos dois filtros": "Arte" e "Música" combinam com OU (NFT de qualquer uma) ou com E (NFT nas duas)? | Recomendo OU | Um NFT tem uma categoria só; com E a listagem ficaria sempre vazia. O OpenSpec anterior registrou OU, mas a frase deste cenário admite as duas leituras | n |
| Q2. Cenário 3 diz "sem precisar buscar de novo": basta o colecionador não refazer a busca (nova requisição com carregamento é aceitável) ou a listagem precisa vir do cache, sem carregamento? | Recomendo nova requisição aceitável | É o que o OpenSpec anterior registrou; o cache instantâneo seria um requisito a mais | n |
| Q3. Mudar o termo ou a ordenação também volta para a página 1, ou só filtro? | Recomendo que sim, termo e ordenação também voltam para a página 1 | O enunciado fala só em "filtro"; ficar na página 3 de outra ordenação mostra itens sem relação com os anteriores | n |
| Q4. Remover uma categoria conta como "mudar um filtro" e volta para a página 1? | Recomendo que sim | "Mudar" cobre adicionar e remover; o cenário 2 só mostra adicionar | n |
| Q5. O termo vai para a URL a cada tecla ou só ao enviar (Enter/botão)? | Recomendo só ao enviar | A cada tecla, o voltar do navegador passaria letra por letra | n |
| Q6. Quais mudanças criam entrada no histórico? Termo, categoria e ordenação criam (o cenário 3 exige para ordenação). E mudar de página: cria entrada ou substitui a atual? | Recomendo que toda mudança, inclusive de página, crie entrada | Voltar da página 3 para a 2 é o comportamento que o colecionador espera do botão voltar | n |
| Q7. IF a URL traz um valor inválido (página `-2`, `abc`, ordenação desconhecida, categoria inexistente), o que a tela faz? | Recomendo usar o padrão do parâmetro inválido (página 1, ordenação padrão, ignorar a categoria) e manter os outros | A URL é editável; a descrição não resolve este caso | n |
| Q8. IF a URL pede uma página além da última (ex.: página 9 com 3 páginas), o que a tela faz? | Sem recomendação: mostrar listagem vazia na página pedida ou levar para a última página | A descrição não resolve; decide o que o colecionador vê com um link antigo | n |
| Q9. Qual é a ordenação padrão, quando a URL não traz nenhuma? | Sem recomendação: depende do Figma ("mais recente" é um candidato) | Os cenários só usam "menor preço" e "mais recente" | n |
| A listagem tem 12 NFTs por página | 12 | O cenário 1 fala em "os mesmos 12 NFTs" | n |

**Open questions:** Q1 a Q9 acima, a responder antes da aprovação.

---

## User Stories

### P1: Refresh mantém a Busca ⭐ MVP

**User Story**: Como colecionador, quero que a Busca fique na URL para que recarregar a página me devolva a mesma listagem.

**Why P1**: É a exigência central do README §3 e o item 1 dos E2E (§9).

**Acceptance Criteria**:

1. WHEN o colecionador busca um termo, filtra por categoria, escolhe uma ordenação ou muda de página THEN o sistema SHALL gravar na URL o termo, as categorias, a ordenação e a página da Busca. <!-- BUSCA-01 -->
2. WHEN o colecionador recarrega a página com a Busca termo "ape", categoria "Arte", ordenação "menor preço" e página 3 THEN o sistema SHALL manter na URL o termo "ape", a categoria "Arte", a ordenação "menor preço" e a página 3. <!-- BUSCA-02 -->
3. WHEN o colecionador recarrega a página THEN o sistema SHALL mostrar na listagem os mesmos 12 NFTs, na mesma ordem, que mostrava antes do refresh. <!-- BUSCA-03 -->
4. The sistema SHALL montar a listagem só a partir dos parâmetros da Busca na URL, pedindo à API exatamente esses parâmetros e 12 NFTs por página. <!-- BUSCA-04 -->

**Independent Test**: Abrir a Busca "ape" + "Arte" + "menor preço" na página 3, anotar os 12 NFTs, recarregar e comparar URL e NFTs.

---

### P1: Mudar um filtro volta para a página 1 ⭐ MVP

**User Story**: Como colecionador, quero que mudar um filtro me leve à página 1 para ver a nova listagem desde o primeiro NFT.

**Why P1**: Exigência do README §3 ("mudança de filtro deve reiniciar a paginação").

**Acceptance Criteria**:

1. WHEN o colecionador, na página 3 da Busca com categoria "Arte", adiciona a categoria "Música" THEN o sistema SHALL gravar na URL as categorias "Arte" e "Música" e a página 1. <!-- BUSCA-05 -->
2. WHEN o colecionador adiciona a categoria "Música" à Busca com categoria "Arte" THEN o sistema SHALL mostrar na listagem, a partir do primeiro, os NFTs que atendem aos dois filtros, combinados conforme a resposta da Q1. <!-- BUSCA-06 -->
3. WHEN o colecionador muda um filtro THEN o sistema SHALL manter na URL o termo e a ordenação da Busca. <!-- BUSCA-07 -->

**Independent Test**: Ir à página 3 com "Arte", marcar "Música" e conferir a URL (as duas categorias, página 1) e o primeiro NFT da listagem.

---

### P1: Voltar no histórico restaura a Busca anterior ⭐ MVP

**User Story**: Como colecionador, quero usar voltar/avançar do navegador para rever a Busca anterior sem refazê-la.

**Why P1**: Exigência do README §3 ("sobreviver a ... navegação pelo histórico").

**Acceptance Criteria**:

1. WHEN o colecionador muda a ordenação de "menor preço" para "mais recente" THEN o sistema SHALL criar uma nova entrada no histórico do navegador. <!-- BUSCA-08 -->
2. WHEN o colecionador usa o botão voltar do navegador uma vez depois de mudar de "menor preço" para "mais recente" THEN o sistema SHALL voltar a URL para a ordenação "menor preço". <!-- BUSCA-09 -->
3. WHEN o colecionador usa o botão voltar do navegador uma vez depois de mudar de "menor preço" para "mais recente" THEN o sistema SHALL mostrar a listagem ordenada por menor preço sem que o colecionador refaça a busca. <!-- BUSCA-10 -->

**Independent Test**: Ordenar por "menor preço", depois por "mais recente", apertar voltar e conferir URL e ordem dos preços.

---

## Edge Cases

Pendentes das respostas: Q3 (termo/ordenação e página 1), Q4 (remover categoria), Q7 (parâmetro inválido na URL) e Q8 (página além da última). Cada resposta vira um critério aqui.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| BUSCA-01 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-02 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-03 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-04 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-05 | P1: Mudar um filtro volta para a página 1 | Specify | Pending |
| BUSCA-06 | P1: Mudar um filtro volta para a página 1 | Specify | Pending |
| BUSCA-07 | P1: Mudar um filtro volta para a página 1 | Specify | Pending |
| BUSCA-08 | P1: Voltar no histórico restaura a Busca anterior | Specify | Pending |
| BUSCA-09 | P1: Voltar no histórico restaura a Busca anterior | Specify | Pending |
| BUSCA-10 | P1: Voltar no histórico restaura a Busca anterior | Specify | Pending |

**Coverage:** 10 total, 0 mapped to tasks.

---

## Sources

- `README.md` §3 › Catálogo e detalhe: Busca na URL, refresh, histórico, filtros combináveis, reinício da paginação.
- `README.md` §4: TanStack Router nos parâmetros de busca, TanStack Query nas consultas, Axios no REST.
- `CLAUDE.md` (glossário): termos Busca, NFT, Catálogo.
- Os três cenários Gherkin do pedido do usuário (2026-11-04).

---

## Success Criteria

- [ ] Os três cenários do pedido passam como E2E no Playwright.
- [ ] Nenhum arquivo fora de `src/catalogo/` muda na implementação.
