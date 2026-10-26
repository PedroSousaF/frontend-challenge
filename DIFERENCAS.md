# DIFERENCAS — busca-na-url (OpenSpec)

- **Acrescentou:** um requisito com SHALL/MUST antes de cada cenário e, no `design.md`, três decisões que meus cenários não tinham (12 NFTs por página virou regra, o termo só vai para a URL ao enviar, parâmetro inválido na URL volta ao padrão).
- **Mudou nos meus cenários:** só o cenário 2, que ganhou "(categoria \"Arte\" ou \"Música\")" para dizer que categorias combinam com OU; o resto ficou palavra por palavra, em GIVEN/WHEN/THEN.
- **Perguntou:** antes de criar qualquer arquivo, fez 3 perguntas: onde fica o scaffold (fora de `src/catalogo/`), se "Arte" + "Música" é OU ou E, e se "sem precisar buscar de novo" exigia cache.
