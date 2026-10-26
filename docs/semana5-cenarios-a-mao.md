# Semana 5 — cenários escritos à mão (antes do agente)

Feature: **busca-na-url** (contexto Catálogo, `src/catalogo/`).

Regra: termo, filtros, ordenação e página da Busca ficam na URL; refresh e voltar/avançar do
navegador restauram exatamente a mesma listagem, e mudar um filtro volta para a página 1
(README §3 › Catálogo e detalhe).

```gherkin
Funcionalidade: Busca do catálogo guardada na URL

  Cenário: Refresh mantém a Busca
    Dado que o colecionador buscou "ape", filtrou pela categoria "Arte" e ordenou por "menor preço"
    E está na página 3 da listagem
    Quando ele recarrega a página
    Então a URL continua com termo "ape", categoria "Arte", ordenação "menor preço" e página 3
    E a listagem mostra os mesmos 12 NFTs que mostrava antes do refresh

  Cenário: Mudar um filtro volta para a página 1
    Dado que o colecionador está na página 3 da Busca com categoria "Arte"
    Quando ele adiciona o filtro de categoria "Música"
    Então a URL passa a ter as categorias "Arte" e "Música" e página 1
    E a listagem mostra os NFTs que atendem aos dois filtros, a partir do primeiro

  Cenário: Voltar no histórico restaura a Busca anterior
    Dado que o colecionador ordenou por "menor preço" e depois mudou para "mais recente"
    Quando ele usa o botão voltar do navegador uma vez
    Então a URL volta a ter a ordenação "menor preço"
    E a listagem volta a ser ordenada por menor preço, sem precisar buscar de novo
```
