# REVIEW — Semanas 5 e 6 (faixa completa)

## O que pedi na sessão de Plan

Abri uma sessão nova. Mandei só o conteúdo do `RESEARCH.md`, o nome do contexto (Compra) e os termos dele no `GLOSSARIO.md`. Pedi a ADR e o documento enxuto, com 5 critérios EARS e 3 cenários BDD.

## O que o agente devolveu

- `docs/adr/0001-cotacao-desatualizada.md`: ao confirmar, revalidar a cotação e exigir aceite explícito quando ela mudar.
- `docs/cotacao-desatualizada-spec.md`: 5 critérios, um de cada padrão EARS, e 3 cenários em Gherkin, um deles de erro (edição esgotada).

## O que rejeitei ou reescrevi, e por quê

- **EARS 4 (cupom):** o agente tinha escrito "mostrando o total sem o desconto". Cortei. Nem o RESEARCH nem o README dizem o que acontece com o desconto quando o cupom expira; o agente inventou a regra.
- **Origem em todo critério:** anotei, ao lado de cada EARS, a frase do RESEARCH e a seção do README de onde ele saiu. Os 5 têm origem; nenhum precisou ser apagado.
- **Escala:** o agente classificou como G porque mexe com dinheiro. Mudei para M: é um passo do checkout, num contexto só.
- **BDD:** mantive os 3 cenários. Conferi que um deles cobre erro ou limite (edição esgotada) e que todos usam números concretos (0,50 → 0,55 ETH).

## Sessão 3 — Implement

A sessão recebeu só a ADR e a spec. Ela devolveu um app Vite + React + TS com TanStack Query, Axios e MSW, tudo em `src/compra/`, e os 3 cenários em `e2e/cotacao-desatualizada.spec.ts`. Resultado do `npx playwright test`: **3 passed**. As contas em ETH usam `BigInt`, para o recibo não divergir por arredondamento.

Pontos que a spec não decidia, onde o agente escolheu o caminho mais restrito e eu aceitei:
- Com a edição esgotada, a confirmação fica bloqueada e não existe botão de remover item. A ADR diz que esta decisão "avisa, mas não resolve"; remover item é do Carrinho.
- O preço muda nos testes por `?cenario=` na URL, que o mock MSW lê. Fica marcado como `shortcut:` até existir o `nft.updated` via Socket.IO, que está fora do escopo desta spec.

Ficou faltando: teste dos critérios 1 (arredondamento) e 4 (cupom), que a spec já marca como sem cenário. Também não fiz TanStack Router, Tailwind e shadcn: esta parte não precisa deles.

## Outra ferramenta

A feature `busca-na-url` também foi especificada no TLC. A comparação está no `DIFERENCAS.md`.
