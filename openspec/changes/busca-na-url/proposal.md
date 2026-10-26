# Proposal

## Why

O README (§3 › Catálogo e detalhe) exige que busca, filtros, ordenação e paginação façam parte do estado da URL, sobrevivam a refresh e à navegação pelo histórico, e que mudar um filtro reinicie a paginação. Hoje não existe implementação. Sem a Busca na URL, o colecionador perde a listagem ao recarregar ou ao usar voltar/avançar, e o item 1 dos testes E2E (§9) não tem como passar.

## What Changes

- A Busca (termo + filtros + ordenação + página) passa a ser lida da URL e escrita nela. A URL é a fonte única de verdade da listagem do catálogo.
- Cada mudança de termo, filtro ou ordenação cria uma nova entrada no histórico do navegador, então voltar/avançar restaura a Busca anterior ou a seguinte.
- Mudar termo, filtro ou ordenação volta a Busca para a página 1. Mudar só a página mantém o resto da Busca.
- O filtro de categoria aceita várias categorias e as combina com OU, porque um NFT tem uma única categoria.
- A listagem pede à API exatamente os parâmetros da URL, 12 NFTs por página. Ao restaurar uma Busca (refresh, voltar/avançar), uma nova requisição com estado de carregamento é aceitável; o colecionador não precisa refazer a busca.

## Capabilities

### New Capabilities
- `catalogo/busca`: estado da Busca do catálogo (termo, categorias, ordenação, página) guardado na URL, restaurado após refresh e histórico, e o reinício da paginação quando um filtro muda.

### Modified Capabilities
<!-- Nenhuma: não há specs existentes em openspec/specs/. -->

## Impact

- **Código**: somente `src/catalogo/`, com a rota/página de Busca, o schema dos parâmetros de URL, a consulta da listagem e os controles de termo, categoria, ordenação e paginação.
- **Fora do escopo**: `src/compra/` (Carrinho, Cotação, Pedido), além de outros filtros que não sejam categoria, além de favoritos, detalhe do NFT e tempo real (`nft.updated`).
- **Dependência**: o scaffold do app vem de uma change separada, pré-requisito desta: Vite/React/TS, raiz do TanStack Router, QueryClient, cliente Axios, MSW com fixtures de NFTs e handler de listagem, e Playwright. Esta change não cria nada fora de `src/catalogo/`.
- **API**: consome o endpoint de listagem de NFTs (§5) com os parâmetros termo, categorias, ordenação, página e tamanho de página. O contrato do endpoint pertence ao scaffold/mocks.
