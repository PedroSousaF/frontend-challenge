# Como as sessões rodaram

Cada linha é uma sessão nova do Claude Code (`claude -p`), sem histórico da anterior.

| sessão | o que recebeu | o que produziu |
|---|---|---|
| Levantamento do glossário | prompt do passo 2 (só leitura) | lista de substantivos do README; o significado foi decidido por mim em `GLOSSARIO.md` |
| Spec semana 5 (OpenSpec) | prompt do slide S44 com os 3 cenários de `docs/semana5-cenarios-a-mao.md`; 1 rodada de respostas às 3 perguntas do agente | `openspec/changes/busca-na-url/` (`openspec validate` ok) |
| 1 — Research | prompt "Sessão 1" com o trecho do README (§3 › Carrinho, § Pagamento, §7); 1 rodada de respostas às 14 perguntas do agente | `RESEARCH.md` |
| 2 — Plan | só o conteúdo do `RESEARCH.md` + contexto Compra e seus termos | `docs/adr/0001-cotacao-desatualizada.md` e `docs/cotacao-desatualizada-spec.md` |

Revisão minha depois do Plan: origem anotada em cada EARS, critério 4 reescrito (o agente inventou "mostrando o total sem o desconto") e escala de G para M.
Sessão 3 (Implement) não rodou: é da faixa completa.
