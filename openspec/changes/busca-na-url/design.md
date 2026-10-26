# Design

## Context

O repositório ainda não tem código: não há `src/` nem `package.json`. O app base (Vite/React/TS, raiz do TanStack Router, QueryClient, cliente Axios, MSW com fixtures e handler de listagem de NFTs, Playwright) vem de uma change separada de scaffold, pré-requisito desta. Esta change só cria arquivos em `src/catalogo/`. A motivação está em proposal.md (Why), e os requisitos estão em `specs/catalogo/busca/spec.md`.

A stack é obrigatória (README §2 e §4): parâmetros de busca pelo TanStack Router, consultas pelo TanStack Query, chamadas REST pelo Axios.

## Goals / Non-Goals

**Goals:**
- A URL é a única fonte de verdade da Busca. Não existe estado local (useState/store) que duplique termo, categorias, ordenação ou página.
- Os parâmetros da URL são validados na entrada da rota, porque a URL é editável pelo usuário.

**Non-Goals:**
- Cache obrigatório ao voltar/avançar: o colecionador aceitou uma nova requisição com carregamento.
- Skeletons com shimmer, estados de vazio/erro e o tratamento de respostas fora de ordem além do que o Query já oferece. Esses comportamentos são exigidos pelo README, mas pertencem a outras changes do catálogo.
- Filtros além de categoria.

## Decisions

### 1. Search params validados pela rota (`validateSearch`)
A rota da Busca, definida em `src/catalogo/`, declara `validateSearch`, que converte a query string em um objeto tipado:

| Parâmetro | Tipo | Padrão | Observação |
| --- | --- | --- | --- |
| `termo` | string | `""` | sem espaços nas pontas |
| `categorias` | string[] | `[]` | combinadas com OU |
| `ordem` | enum (`menor-preco`, `mais-recente`, …) | ver Open Questions | |
| `pagina` | inteiro ≥ 1 | `1` | |

Um valor inválido (página `-2`, ordem desconhecida) cai no padrão em vez de quebrar a tela.
- *Alternativa*: ler `window.location.search` à mão. Rejeitada porque o README exige o TanStack Router nos parâmetros de busca e ela perde a tipagem.
- O schema usa a validação que o scaffold já tiver (ou funções simples). Esta change não adiciona biblioteca.

### 2. Toda mudança é um `navigate` com push no histórico
Termo, categoria, ordenação e página mudam via `navigate({ search: (prev) => ({ ...prev, ... }) })`, que por padrão faz push no histórico. Assim, voltar/avançar funciona sem código extra: o router relê a URL e a consulta reage.
- Mudar termo, categorias ou ordenação grava `pagina: 1` na mesma navegação. Mudar a página altera só `pagina`.
- O termo é gravado ao enviar o campo (Enter/botão), e não a cada tecla, para não encher o histórico com uma entrada por letra.
- *Alternativa*: `replace` para o termo. Rejeitada porque voltar não restauraria o termo anterior.

### 3. Consulta derivada da URL
`useQuery` com `queryKey: ['catalogo', 'nfts', search]` e `queryFn` chamando o endpoint de listagem pelo cliente Axios do scaffold. Os parâmetros são `termo`, `categorias`, `ordem`, `pagina` e `tamanho=12`, e o `signal` do Query é repassado para cancelar a requisição obsoleta. Como a chave contém a Busca inteira, cada combinação de parâmetros tem seu próprio resultado, e uma resposta atrasada de outra Busca não aparece na tela.
- `TAMANHO_PAGINA = 12` é uma constante em `src/catalogo/`.

### 4. Onde moram os arquivos
Tudo em `src/catalogo/busca/`: a rota (definida em código e exportada), o schema dos params, o hook da consulta, os componentes de controle e a listagem, e o teste E2E `busca-na-url.spec.ts`. O scaffold registra a rota exportada na árvore do router e inclui `src/**/*.spec.ts` no `testMatch` do Playwright.

## Risks / Trade-offs

- [O scaffold usa roteamento por arquivos (`src/routes/`), e a rota não poderia morar em `src/catalogo/`] → manter em `src/routes/` apenas um arquivo de uma linha que reexporta a rota de `src/catalogo/`. Isso pertence ao scaffold, não a esta change.
- [As fixtures do MSW não têm NFTs suficientes para chegar à página 3 com "ape" + "Arte"] → as fixtures do scaffold precisam de pelo menos 25 NFTs que casem com "ape" na categoria "Arte". O E2E falha de forma explícita se isso não acontecer.
- [Preço em tempo real (`nft.updated`) muda a ordem por "menor preço" entre o refresh e a nova consulta] → o E2E roda sem disparar eventos de socket, então "os mesmos 12 NFTs" depende de dados estáveis.
- [Arrays na query string usam a serialização padrão do TanStack Router (JSON), que fica menos legível que `?categoria=arte&categoria=musica`] → aceito. Trocar o serializador seria uma configuração global do router, fora de `src/catalogo/`.

## Open Questions

- A lista completa de ordenações e o padrão (por exemplo, "mais recente") dependem do Figma. Os cenários só usam "menor preço" e "mais recente", então isso não muda specs nem tarefas.
- Os slugs exatos das categorias (por exemplo, `arte`, `musica`) vêm das fixtures do scaffold.
