# Como as sessões rodaram

Cada linha é uma sessão nova do Claude Code (`claude -p`), sem histórico da anterior.

| sessão | o que recebeu | o que produziu |
|---|---|---|
| Levantamento do glossário | prompt do passo 2 (só leitura) | lista de substantivos do README; o significado foi decidido por mim em `GLOSSARIO.md` |
| Spec semana 5 (OpenSpec) | prompt do slide S44 com os 3 cenários de `docs/semana5-cenarios-a-mao.md`; 1 rodada de respostas às 3 perguntas do agente | `openspec/changes/busca-na-url/` (`openspec validate` ok) |
| 1 — Research | prompt "Sessão 1" com o trecho do README (§3 › Carrinho, § Pagamento, §7); 1 rodada de respostas às 14 perguntas do agente | `RESEARCH.md` |
| 2 — Plan | só o conteúdo do `RESEARCH.md` + contexto Compra e seus termos | `docs/adr/0001-cotacao-desatualizada.md` e `docs/cotacao-desatualizada-spec.md` |
| 3 — Implement | só a ADR e a spec revisadas + a stack do README que esta parte usa | app Vite em `src/compra/` com MSW e 3 testes Playwright em `e2e/` (os 3 passam) |
| Spec semana 5 (TLC) | prompt TLC do slide S44 com os mesmos 3 cenários; glossário no fim do `CLAUDE.md` | `.specs/features/busca-na-url/spec.md` (2 rodadas de respostas às 9 + 2 perguntas do agente, dadas pelo Claude Code a meu pedido; validador: 0 erros, 0 avisos; 22 critérios; spec ainda sem aprovação) |

Revisão minha depois do Plan: origem anotada em cada EARS, critério 4 reescrito (o agente inventou "mostrando o total sem o desconto") e escala de G para M.
