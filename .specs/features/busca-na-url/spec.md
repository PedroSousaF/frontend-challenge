# busca-na-url Specification

**Approved**: 2026-11-04 - user: "aprovo a spec"

## Problem Statement

O README (§3 › Catálogo e detalhe) exige que a Busca (termo, filtros, ordenação e página) faça parte do estado da URL, sobreviva a refresh e à navegação pelo histórico, e que mudar um filtro reinicie a paginação. Sem isso, o colecionador perde a listagem ao recarregar ou ao usar voltar/avançar, e o item 1 dos testes E2E (§9) não passa.

## Goals

- [ ] Refresh e voltar/avançar do navegador restauram a mesma URL e a mesma listagem da Busca.
- [ ] Mudar termo, filtro ou ordenação grava a nova Busca na URL com página 1.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Tudo em `src/compra/` (Carrinho, Cotação, Pedido) | Pedido do usuário: só `src/catalogo/` |
| Filtros além de categoria | Os cenários só usam categoria |
| Detalhe do NFT, favoritos, destaques | Outras features do Catálogo |
| Preço em tempo real (`nft.updated`) reordenando a listagem | Outra feature; os cenários assumem dados estáveis entre o refresh e a nova consulta |
| Listagem servida do cache ao voltar/avançar, sem carregamento | Q2: nova requisição com carregamento é aceitável |
| Estados de vazio, erro, skeleton e respostas fora de ordem da listagem | Exigidos pelo README (§3, §4), mas não fazem parte destes cenários |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Q1. Como "Arte" e "Música" se combinam | OU: NFTs de qualquer uma das categorias escolhidas | user: "OU. Um NFT tem uma categoria só." | y |
| Q2. "Sem precisar buscar de novo" exige cache? | Não: nova requisição com estado de carregamento é aceitável | user: "uma nova requisição, com estado de carregamento, é aceitável." | y |
| Q3. Mudar termo ou ordenação volta para a página 1? | Sim | user: "sim, mudar o termo ou a ordenação também volta para a página 1." | y |
| Q4. Remover uma categoria volta para a página 1? | Sim | user: "sim, remover uma categoria também volta para a página 1." | y |
| Q5. Quando o termo vai para a URL | Só ao enviar a busca | user: "o termo vai para a URL só ao enviar a busca." | y |
| Q6. Mudar de página cria entrada no histórico? | Sim, uma entrada nova | user: "mudar de página cria uma entrada nova no histórico." | y |
| Q7. Parâmetro inválido na URL | O parâmetro inválido volta ao seu padrão; os outros são mantidos | user: "o parâmetro inválido volta ao seu padrão, e os outros parâmetros são mantidos." | y |
| Q8. Página além da última | Vai para a última página que existe e corrige a URL substituindo a entrada atual do histórico | user: "leva para a última página que existe e corrige a URL, substituindo a entrada atual do histórico sem criar uma nova." | y |
| Q9. Ordenação padrão | "mais recente" | user: "a ordenação padrão é \"mais recente\"." | y |
| Tamanho da página | 12 NFTs por página | user: "12 NFTs por página: confirmado." | y |
| Q10. Com um parâmetro inválido (Q7), a URL também é corrigida? | Sim: a URL é corrigida para o padrão, substituindo a entrada atual do histórico | user: "sim. A URL é corrigida para o padrão, substituindo a entrada atual do histórico, igual à Q8." | y |
| Q11. Página pedida numa Busca sem nenhum NFT | Vira página 1, corrigindo a URL por substituição | user: "vira página 1, corrigindo a URL também por substituição." | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Refresh mantém a Busca ⭐ MVP

**User Story**: Como colecionador, quero que a Busca fique na URL para que recarregar a página me devolva a mesma listagem.

**Why P1**: É a exigência central do README §3 e o item 1 dos E2E (§9).

**Acceptance Criteria**:

1. WHEN o colecionador envia um termo, filtra por categoria, escolhe uma ordenação ou muda de página THEN o sistema SHALL gravar na URL o termo, as categorias, a ordenação e a página da Busca. <!-- BUSCA-01 -->
2. WHEN o colecionador recarrega a página com a Busca termo "ape", categoria "Arte", ordenação "menor preço" e página 3 THEN o sistema SHALL manter na URL o termo "ape", a categoria "Arte", a ordenação "menor preço" e a página 3. <!-- BUSCA-02 -->
3. WHEN o colecionador recarrega a página THEN o sistema SHALL mostrar na listagem os mesmos 12 NFTs, na mesma ordem, que mostrava antes do refresh. <!-- BUSCA-03 -->
4. The sistema SHALL montar a listagem só a partir dos parâmetros da Busca na URL, pedindo à API exatamente esses parâmetros e 12 NFTs por página. <!-- BUSCA-04 -->
5. WHILE o colecionador digita no campo de termo sem enviar a busca, the sistema SHALL manter na URL o termo anterior. <!-- BUSCA-11 -->
6. WHEN o colecionador envia a busca THEN o sistema SHALL gravar o termo digitado na URL. <!-- BUSCA-12 -->
7. WHEN a URL não traz ordenação THEN o sistema SHALL ordenar a listagem por "mais recente". <!-- BUSCA-13 -->

**Independent Test**: Abrir a Busca "ape" + "Arte" + "menor preço" na página 3, anotar os 12 NFTs, recarregar e comparar URL e NFTs.

---

### P1: Mudar um filtro volta para a página 1 ⭐ MVP

**User Story**: Como colecionador, quero que mudar termo, filtro ou ordenação me leve à página 1 para ver a nova listagem desde o primeiro NFT.

**Why P1**: Exigência do README §3 ("mudança de filtro deve reiniciar a paginação").

**Acceptance Criteria**:

1. WHEN o colecionador, na página 3 da Busca com categoria "Arte", adiciona a categoria "Música" THEN o sistema SHALL gravar na URL as categorias "Arte" e "Música" e a página 1. <!-- BUSCA-05 -->
2. WHEN o colecionador adiciona a categoria "Música" à Busca com categoria "Arte" THEN o sistema SHALL mostrar na listagem, a partir do primeiro, os NFTs da categoria "Arte" ou da categoria "Música". <!-- BUSCA-06 -->
3. WHEN o colecionador muda um filtro THEN o sistema SHALL manter na URL o termo e a ordenação da Busca. <!-- BUSCA-07 -->
4. WHEN o colecionador, na página 3 da Busca com categorias "Arte" e "Música", remove a categoria "Música" THEN o sistema SHALL gravar na URL só a categoria "Arte" e a página 1. <!-- BUSCA-14 -->
5. WHEN o colecionador, na página 3 da Busca, envia um termo diferente THEN o sistema SHALL gravar na URL o novo termo e a página 1. <!-- BUSCA-15 -->
6. WHEN o colecionador, na página 3 da Busca, muda a ordenação THEN o sistema SHALL gravar na URL a nova ordenação e a página 1. <!-- BUSCA-16 -->

**Independent Test**: Ir à página 3 com "Arte", marcar "Música" e conferir a URL (as duas categorias, página 1) e o primeiro NFT da listagem.

---

### P1: Voltar no histórico restaura a Busca anterior ⭐ MVP

**User Story**: Como colecionador, quero usar voltar/avançar do navegador para rever a Busca anterior sem refazê-la.

**Why P1**: Exigência do README §3 ("sobreviver a ... navegação pelo histórico").

**Acceptance Criteria**:

1. WHEN o colecionador muda a ordenação de "menor preço" para "mais recente" THEN o sistema SHALL criar uma nova entrada no histórico do navegador. <!-- BUSCA-08 -->
2. WHEN o colecionador usa o botão voltar do navegador uma vez depois de mudar de "menor preço" para "mais recente" THEN o sistema SHALL voltar a URL para a ordenação "menor preço". <!-- BUSCA-09 -->
3. WHEN o colecionador usa o botão voltar do navegador uma vez depois de mudar de "menor preço" para "mais recente" THEN o sistema SHALL mostrar a listagem ordenada por menor preço, com uma nova requisição e estado de carregamento permitidos, sem que o colecionador refaça a busca. <!-- BUSCA-10 -->
4. WHEN o colecionador muda da página 2 para a página 3 THEN o sistema SHALL criar uma nova entrada no histórico do navegador. <!-- BUSCA-17 -->
5. WHEN o colecionador usa o botão voltar do navegador uma vez depois de mudar da página 2 para a página 3 THEN o sistema SHALL restaurar a página 2 na URL e na listagem. <!-- BUSCA-20 -->

**Independent Test**: Ordenar por "menor preço", depois por "mais recente", apertar voltar e conferir URL e ordem dos preços.

---

## Edge Cases

1. IF a URL traz um parâmetro inválido (página `-2` ou `abc`, ordenação desconhecida, categoria inexistente) THEN o sistema SHALL usar o padrão desse parâmetro (página 1, ordenação "mais recente", sem a categoria inexistente) e manter os outros parâmetros da Busca. <!-- BUSCA-18 -->
2. IF a URL pede uma página além da última que existe (ex.: página 9 numa Busca com 3 páginas) THEN o sistema SHALL mostrar a última página que existe e corrigir a URL para ela, substituindo a entrada atual do histórico sem criar uma nova. <!-- BUSCA-19 -->
3. IF a URL traz um parâmetro inválido THEN o sistema SHALL corrigir esse parâmetro na URL para o seu padrão, substituindo a entrada atual do histórico sem criar uma nova. <!-- BUSCA-21 -->
4. IF a URL pede uma página maior que 1 numa Busca sem nenhum NFT THEN o sistema SHALL mostrar a página 1 e corrigir a URL para a página 1, substituindo a entrada atual do histórico sem criar uma nova. <!-- BUSCA-22 -->

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
| BUSCA-11 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-12 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-13 | P1: Refresh mantém a Busca | Specify | Pending |
| BUSCA-14 | P1: Mudar um filtro volta para a página 1 | Specify | Pending |
| BUSCA-15 | P1: Mudar um filtro volta para a página 1 | Specify | Pending |
| BUSCA-16 | P1: Mudar um filtro volta para a página 1 | Specify | Pending |
| BUSCA-17 | P1: Voltar no histórico restaura a Busca anterior | Specify | Pending |
| BUSCA-18 | Edge Cases | Specify | Pending |
| BUSCA-19 | Edge Cases | Specify | Pending |
| BUSCA-20 | P1: Voltar no histórico restaura a Busca anterior | Specify | Pending |
| BUSCA-21 | Edge Cases | Specify | Pending |
| BUSCA-22 | Edge Cases | Specify | Pending |

**Coverage:** 22 total, 0 mapped to tasks.

---

## Sources

- `README.md` §3 › Catálogo e detalhe: Busca na URL, refresh, histórico, filtros combináveis, reinício da paginação.
- `README.md` §4: TanStack Router nos parâmetros de busca, TanStack Query nas consultas, Axios no REST.
- `CLAUDE.md` (glossário): termos Busca, NFT, Catálogo.
- Os três cenários Gherkin do pedido do usuário (2026-11-04).
- Respostas do usuário às perguntas Q1 a Q11 e ao tamanho de página (2026-11-04).

---

## Success Criteria

- [ ] Os três cenários do pedido passam como E2E no Playwright.
- [ ] Nenhum arquivo fora de `src/catalogo/` muda na implementação.
