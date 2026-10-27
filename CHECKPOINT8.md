# Checkpoint 8 — Carry the Ice

## Controles
- X/K: usar o poder atual. Carregando gelo, arremessa em vez de disparar outro poder.
- E/J: pegar ou soltar um inimigo congelado próximo.
- Baixo + X/K: quebrar gelo próximo, inclusive o bloco sob os pés. Carregando um objeto, X/K continua arremessando.
- No toque, GRAB pega/solta e POWER arremessa. CROUCH + POWER quebra gelo próximo. Botões passam a focar o canvas para facilitar alternar toque/mouse e teclado.
- Caminhar e saltar carregando continuam disponíveis. Passagens que não comportam o conjunto bloqueiam o movimento; o personagem não deve atravessar paredes nem virar o objeto para dentro delas.

## Estados e regras
Os inimigos têm estados normal, congelado, carregado, arremessado e quebrado. O gelo dura seis segundos no cenário, sinaliza os últimos 1,5 segundos e pausa enquanto carregado. Só um objeto pode ser carregado por vez; a aproximação e o trajeto até a posição de transporte precisam estar livres.
Congelados obedecem à gravidade e servem de apoio sólido, exceto plantas fixas. Aterrissar ou encostar em um inimigo transportável congelado não o quebra automaticamente. Para quebrar, use Baixo + X/K ou um ataque compatível. Pancadas por baixo em blocos continuam quebrando inimigos congelados apoiados em cima.
Plantas mantêm raiz fixa: não podem ser carregadas e continuam podendo congelar e quebrar.
Não é necessário continuar com Ice Flower para transportar um inimigo já congelado. Mudar de poder por coleta mantém o transporte se a posição continua válida. Receber dano tenta soltá-lo com segurança; sem espaço, quebra o objeto em vez de criar sobreposição.

## Arremesso e impactos
O arremesso tem velocidade horizontal de 420 unidades/s, impulso vertical de -180 e gravidade configurável. A colisão usa passos de no máximo quatro unidades para evitar atravessar obstáculos.
O primeiro obstáculo interrompe o arremesso. Paredes e impactos fortes quebram o objeto. Aterrissagens suaves (até 360 unidades/s na descida) preservam o gelo, que para no local e retoma uma contagem de pelo menos dois segundos. Um voo expira após 2,8 segundos sem virar um inimigo ativo no ar. Lava destrói o gelo.
Acertar outro inimigo causa dois pontos de dano, respeitando sua proteção temporária. Um alvo já congelado quebra. O objeto lançado também quebra uma única vez no impacto. O lançamento não machuca Jarvis.
Objetos de gelo lançados quebram ao tocar bosses sem causar dano: não criam um atalho para contornar a imunidade do Sentinela. A regra anterior dos projéteis permanece: Ice não tira vida do Sentinela; Fire, Hammer e pisões funcionam. O projétil de Ice continua com o comportamento anterior no Storm King, sem congelá-lo ou permitir carregá-lo.

## Descongelamento seguro
Ao acabar o tempo, o descongelamento aguarda se Jarvis estiver perto, apoiado em cima, ou se o corpo estiver sobreposto a terreno/outro inimigo. O jogo tenta novamente em intervalos curtos, mantendo o estado seguro.
Ao descongelar, o inimigo recebe 0,8 segundo sem dano por contato, redefine sua área de patrulha ao redor da nova posição e reinicia o temporizador de ataque. Não dispara ataques acumulados. O gelo não descongela durante transporte ou voo.

## Fases e preservação
As fases 3 (Amber Aqueduct) e 10 (Emberworks), que oferecem Ice Flower, receberam pistas e pequenos desvios opcionais de moedas para experimentar apoio, transporte e arremesso. A rota principal permanece possível sem essas novas interações. Não há novos mundos, arquétipos de casco/voador/planta de fogo ou sistema completo de segredos neste pacote.
As 17 etapas, poderes, blocos invisíveis, Hammer Flower, mapa, vidas, moedas, Game Over, pausa, desafios de nuvem e salvamento existente foram preservados. Objetos carregados são descartados corretamente em morte, mapa, conclusão, saída, reinício e recuperação dos desafios de nuvem. Não são salvos nem transferidos entre fases.
A pausa congela física e temporizadores. Elevadores consideram também o volume do objeto carregado; plataformas temporárias aguardam uma área livre antes de reaparecer sobre gelo ou personagem.

## Verificação realizada
- 61 grupos de testes do jogo, 13 de mecânicas e 13 específicos de gelo: 87 passaram.
- Cobertura nova: congelamento, apoio sólido, gravidade, transporte e contagem pausada; proximidade e paredes; tetos, corredores, mudança de direção e bordas do mundo; soltar sem sobrepor; recusa quando não há espaço; limpeza forçada; primeiro impacto e paredes protegendo alvos; dois pontos de dano; quebra única; pouso suave/forte; voo expirado; apoio sem quebra automática; gesto explícito de quebra; aviso e descongelamento adiado; imunidade de bosses; plantas; lava; elevador com carga e teto; teclas reais integradas; pausa, dano e todos os caminhos de saída/reinício.
- Testes anteriores de física, transformações, primeira fase com comandos normais, mapa, moedas, vidas, cogumelos verdes, blocos e oito travessias obrigatórias de nuvem continuam passando.
- Compilação do portfólio concluída. Permanecem avisos anteriores do React Router e sitemap sem domínio configurado.
- Navegador: em cenas locais de teste, X congelou o inimigo, E o carregou, GRAB o soltou, e transporte/novo arremesso derrotaram um alvo com dois pontos de vida. Foi conferido apoio sobre o gelo sem quebra e descongelamento após afastar Jarvis. Sem erros de console nas cenas inspecionadas.
- As cenas de teste expunham atalhos para acessar as situações e indicadores de estado; não fazem parte do ZIP. Não houve partida humana completa das 17 fases, teste em celular físico ou medição formal de FPS. O equilíbrio, a clareza das pistas e a sensação do transporte em toda a campanha ainda precisam da avaliação do jogador.

## Instalação pelo GitHub
1. Extraia jarvis-checkpoint-8-completo.zip em uma pasta nova.
2. Na raiz de ThalesXavier-Lab, escolha Add file > Upload files.
3. Envie os quatro itens diretamente: public, scripts, CHECKPOINT8.md e JARVIS.md. Não envie o ZIP fechado nem a pasta externa.
4. Clique Commit changes. Aguarde a publicação verde da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e pressione Ctrl+F5.
6. Confira CHECKPOINT 8 · CARRY THE ICE.

A pasta scripts inclui agora test-jarvis.mjs, test-jarvis-world.mjs e test-jarvis-ice.mjs. O ZIP traz toda a pasta do jogo, sem cenas de prévia, para evitar mistura de versões. O portfólio e src não foram alterados. Não precisa apagar progresso. Nada foi publicado automaticamente; o envio segue o fluxo manual pelo GitHub.

## Checklist do jogador
- Congelar, aproximar, E para pegar, caminhar nas duas direções, saltar e E para soltar.
- Tentar pegar por trás de parede ou em corredor sem espaço: a ação deve ser recusada.
- X para lançar; experimentar lançar durante um salto para alcançar alvos mais distantes. Conferir paredes e alvos resistentes.
- Saltar sobre o gelo e ficar apoiado; Baixo + X deve quebrá-lo explicitamente.
- Observar o aviso antes do descongelamento; perto de Jarvis, deve esperar, e longe dele deve voltar ao normal sem ataque instantâneo.
- Testar dano, pausa, sair, morrer, reiniciar e trocar de fase enquanto carrega: nenhum objeto deve ficar duplicado ou acompanhar a nova fase.
- Conferir que plantas não são carregadas e que o Sentinela continua imune ao gelo.
