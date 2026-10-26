# Spec Delta

## Purpose

Guardar a Busca do catálogo (termo, filtros, ordenação e página) na URL, para que o colecionador recupere exatamente a mesma listagem depois de um refresh ou ao navegar pelo histórico do navegador.

## ADDED Requirements

### Requirement: Busca guardada na URL sobrevive a refresh
O sistema SHALL guardar na URL o termo, as categorias, a ordenação e a página da Busca, e SHALL montar a listagem só a partir desses parâmetros. Ao recarregar, a URL MUST continuar igual e a listagem MUST mostrar os mesmos NFTs na mesma posição, com 12 NFTs por página. Uma nova requisição com estado de carregamento é aceitável; o colecionador MUST NOT precisar refazer a busca.

#### Scenario: Refresh mantém a Busca
- **GIVEN** o colecionador buscou "ape", filtrou pela categoria "Arte" e ordenou por "menor preço"
- **AND** está na página 3 da listagem
- **WHEN** ele recarrega a página
- **THEN** a URL continua com termo "ape", categoria "Arte", ordenação "menor preço" e página 3
- **AND** a listagem mostra os mesmos 12 NFTs que mostrava antes do refresh

### Requirement: Mudar um filtro volta para a página 1
Quando o colecionador muda um filtro da Busca, o sistema SHALL gravar a nova Busca na URL com página 1, mantendo os demais parâmetros. Várias categorias selecionadas MUST ser combinadas com OU (cada NFT tem uma única categoria): a listagem traz os NFTs de qualquer uma das categorias escolhidas.

#### Scenario: Mudar um filtro volta para a página 1
- **GIVEN** o colecionador está na página 3 da Busca com categoria "Arte"
- **WHEN** ele adiciona o filtro de categoria "Música"
- **THEN** a URL passa a ter as categorias "Arte" e "Música" e página 1
- **AND** a listagem mostra os NFTs que atendem aos dois filtros (categoria "Arte" ou "Música"), a partir do primeiro

### Requirement: Voltar e avançar no histórico restauram a Busca
Cada mudança na Busca feita pelo colecionador SHALL criar uma nova entrada no histórico do navegador. Voltar ou avançar MUST restaurar a URL dessa entrada e a listagem correspondente, sem que o colecionador precise refazer a busca. Uma nova requisição com estado de carregamento é aceitável.

#### Scenario: Voltar no histórico restaura a Busca anterior
- **GIVEN** o colecionador ordenou por "menor preço" e depois mudou para "mais recente"
- **WHEN** ele usa o botão voltar do navegador uma vez
- **THEN** a URL volta a ter a ordenação "menor preço"
- **AND** a listagem volta a ser ordenada por menor preço, sem precisar buscar de novo
