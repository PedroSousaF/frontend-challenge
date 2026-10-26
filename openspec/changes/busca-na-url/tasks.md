# Tasks

## 1. Pré-requisito e parâmetros da Busca

- [ ] 1.1 Confirmar que a change de scaffold está aplicada: verificar que `npm run dev` sobe o app com mocks, que o handler MSW de listagem de NFTs responde a termo/categorias/ordem/pagina/tamanho e que as fixtures têm ≥ 25 NFTs com "ape" na categoria "Arte". Se faltar algo, parar e avisar, sem criar nada fora de `src/catalogo/`.
- [ ] 1.2 Criar `src/catalogo/busca/parametros.ts` com o tipo da Busca, `TAMANHO_PAGINA = 12` e a função de `validateSearch` (termo, categorias, ordem, pagina, com fallback ao padrão para valores inválidos), conforme design §1. Verificar com a checagem de tipos do projeto (`tsc --noEmit`).

## 2. Rota e listagem guiadas pela URL

- [ ] 2.1 Criar em `src/catalogo/busca/` a rota da Busca (definida em código e exportada) usando `validateSearch`, e o hook `useQuery` com chave `['catalogo', 'nfts', search]`, chamando a listagem via Axios com `tamanho=12` e repassando o `signal` (design §3). Verificar abrindo `/?termo=ape&categorias=...&ordem=menor-preco&pagina=3` e conferindo, no painel de rede, que a requisição leva os mesmos parâmetros.
- [ ] 2.2 Renderizar a listagem dos 12 NFTs da página atual a partir do resultado da consulta, sem estado local que duplique a Busca. Verificar que editar a URL à mão muda a listagem.
- [ ] 2.3 Escrever em `src/catalogo/busca/busca-na-url.spec.ts` o E2E do cenário "Refresh mantém a Busca": anotar os 12 NFTs, recarregar, e verificar a mesma URL e os mesmos 12 NFTs na mesma ordem. Verificar que `npx playwright test busca-na-url` passa.

## 3. Controles que mudam a Busca

- [ ] 3.1 Criar os controles de categoria (múltipla escolha, combinadas com OU) e de ordenação, que navegam com push gravando `pagina: 1` (design §2). Adicionar ao E2E o cenário "Mudar um filtro volta para a página 1": partindo da página 3 com "Arte", adicionar "Música" e verificar categorias Arte+Música, página 1, e que todos os NFTs listados são de Arte ou Música a partir do primeiro. O teste MUST passar.
- [ ] 3.2 Criar o campo de termo (grava ao enviar, com página 1) e a paginação (muda só `pagina`), ambos com push no histórico. Verificar manualmente que buscar "ape" e ir à página 3 gera URL e listagem corretas. Esse caminho é usado no setup do E2E 2.3.
- [ ] 3.3 Adicionar ao E2E o cenário "Voltar no histórico restaura a Busca anterior": ordenar por "menor preço", mudar para "mais recente", chamar `page.goBack()` uma vez, e verificar a URL com `ordem=menor-preco` e a listagem ordenada por menor preço sem nenhuma ação do colecionador. O teste MUST passar.

## 4. Verificação integrada

- [ ] 4.1 Rodar a suíte `busca-na-url` nos projetos desktop e mobile do Playwright (Chromium) e verificar que os três cenários passam. Rodar a checagem de tipos e o lint. Confirmar com `git status` que só arquivos de `src/catalogo/` foram alterados.

## Workflow follow-up

- Arquivar a change (`/opsx:archive`) depois da revisão.
