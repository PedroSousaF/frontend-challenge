# RESEARCH — Colecionador confirma compra com cotação desatualizada

> **Fonte única:** o README do desafio (citado como **[README]**, com a linha). Não houve
> entrevista com colecionador real. Tudo que vai além do README está marcado como
> **[Hipótese]** e precisa ser validado antes de virar premissa.

## Quem sente a dor

O **colecionador que está comprando**: a pessoa que montou um carrinho e vai finalizar o pedido.

- Ele monta o carrinho escolhendo NFT, edição e quantidade inteira, e pode editar quantidades, remover itens e aplicar cupom. **[README, l. 37–38, 60–62]**
- O perfil que mais sofre é o de quem tem **mais de um NFT no carrinho**, porque cada item é um ponto a mais onde algo pode mudar. **[Hipótese]**
- Não sabemos se ele acompanha o mercado e espera oscilação ou se é casual e espera pagar o preço que viu. **[Hipótese, em aberto]**
- O README não cita suporte nem vendedor como afetados. Não sabemos se mais alguém sente a dor. **[Em aberto]**

## Em que momento ela aparece

Entre **colocar o NFT no carrinho** e **confirmar a compra**, quando o preço ou a disponibilidade mudam nesse meio-tempo.

- O README trata isso como cenário central: "preço alterado ou edição esgotada durante a compra". **[README, l. 141]**
- O comportamento esperado é que ele perceba a mudança **enquanto o carrinho está aberto** e, no pior caso, **no momento de confirmar**. Uma cotação desatualizada não deve passar. **[README, cenário: passos 1–4; l. 72]**
- **A dor é perceber tarde demais**, ou seja, só no recibo, ou **não perceber nada**.
- Os quatro itens que podem mudar são **preço**, **disponibilidade** (edição esgotada), **cupom** (inválido ou expirado) e **taxas**. **[README, l. 62, 72, 140–141]** Os dois do cenário principal são preço e disponibilidade.
- Não sabemos quanto tempo passa entre o carrinho e o checkout. A compra pode atravessar a navegação e até uma expiração de sessão no meio do checkout, o que sugere minutos ou mais. **[README, l. 84; duração é Hipótese]**

## O que essa pessoa diria, com as próprias palavras

*Reconstrução, não citação. Não temos fala real de colecionador.*

> "Eu vi 0,50 ETH no carrinho, cliquei em pagar e o recibo veio com outro valor. Ninguém me avisou."

O que mais incomoda é **pagar um valor diferente do que aceitou sem ter sido avisado**. **[Hipótese]**

## O que isso custa hoje

Não temos medição real. O que existe é um exemplo ilustrativo e hipóteses:

| Custo | Valor | Origem |
|---|---|---|
| Diferença de dinheiro num caso ruim | viu **0,50 ETH**, cotação foi para **0,55 ETH**, ou seja, **+0,05 ETH (+10%)** | Exemplo ilustrativo, não é dado real |
| Tempo perdido quando a edição esgota no fim | Precisa voltar ao catálogo e montar o carrinho de novo. Duração **não medida** | Hipótese |
| Total mostrado diferente do total cobrado por arredondamento | **Nenhum incidente relatado.** O README exige precisão nos valores em ETH, o que leio como cautela contra esse erro | [README, trecho de valores em ETH] + leitura |
| Confiança | Depois de uma surpresa, ele perde a confiança na loja e desiste da compra | Hipótese |

**Lacuna:** não há números reais de frequência nem de valor perdido. Este é o principal ponto a validar.

## O que já foi tentado (se algo foi)

Nada documentado. Hipótese: o colecionador **recarrega a página antes de pagar** para conferir o preço. Isso depende de ele lembrar de fazer e não o protege de uma mudança que aconteça entre recarregar e confirmar. **[Hipótese]**

## Ligação com a semana 5

Contexto **Compra**, o mesmo nome do `GLOSSARIO.md`.

- A cotação da Compra é a referência para finalizar o pedido. **[README]** É na Compra que a dor acontece, porque é ali que se confirma com um valor velho.
- O preço e a disponibilidade que mudam **vêm do Catálogo**. O Catálogo é a origem da mudança, não o lugar da dor.

## Perguntas em aberto para validar

1. O colecionador acompanha a oscilação do mercado ou espera um preço fixo?
2. Quanto tempo passa, na prática, entre o carrinho e a confirmação?
3. Com que frequência o preço ou a disponibilidade mudam nesse intervalo?
4. Depois de uma surpresa, ele desiste mesmo ou aceita o novo valor?
5. Alguém além do colecionador sente o efeito, como suporte ou vendedor?

---

## Checklist de saída da sessão de Research

- [x] Não tem nenhuma palavra de solução técnica neste arquivo (nome de lib, de tabela, de
      endpoint). Se tiver, apague — isso é trabalho da sessão de Plan.
- [x] Uma pessoa que não conhece o seu projeto consegue ler isto e entender o problema.
- [ ] Você conseguiria mostrar este arquivo pra pessoa que sente a dor e ela diria "é
      isso mesmo" — não "não é bem assim". *(Não verificável: não houve colecionador real
      para validar. Fica pendente.)*
