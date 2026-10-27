# Jarvis Adventure — Checkpoint 3
Base: ThalesXavier-Lab, commit 008fc290903b61cd8f2a26bd68abf1eb2560d66a.

## Regras solicitadas
- Cada caixa ? fornece um único item durante a tentativa. A lógica de reabastecimento foi removida.
- Ao ativar a caixa por baixo: SMALL recebe Super Mushroom; SUPER ou qualquer forma especial recebe o poder específico da fase.
- Não aparece cogumelo automaticamente ao entrar na fase nem ao retornar a um checkpoint.
- Foram colocadas caixas próximas do início e de cada checkpoint. Há duas oportunidades de item para permitir crescer e depois conseguir o poder.
- Ao morrer e tentar novamente, o cenário é recriado, incluindo caixas novas. O uso único vale dentro de cada tentativa; não é um bloqueio permanente de caixas entre mortes.
- Nenhum caminho principal exige conservar um poder, evitando ficar preso após gastar caixas ou sofrer dano.

## Percursos e dificuldade
As 15 fases regulares mantêm sua identidade do Checkpoint 2 e receberam novas seções próprias em campaign.mjs. Não foi alterada a física de salto para aumentar dificuldade.
- A primeira fase vai de 2.500 a 3.300 unidades de mundo e termina com um salto curto, sem uma nova armadilha.
- Os tamanhos regulares crescem de 3.300 a 7.500, em passos de 300 unidades.
- Foram acrescentados trechos de escalada, túneis, gelo, plataformas móveis, cadeias temporárias, patrulhas e ciclos de armadilhas de acordo com o tema.
- Fases iniciais introduzem ideias isoladas; fases avançadas prolongam e combinam as mecânicas.
- A torre tem 5.600 unidades, com aproximação própria e chefe de 6 pontos de vida.
- O castelo final tem 8.100 unidades, mais transferências, escalada, armadilhas e o chefe final de 10 pontos de vida. É a proposta de maior desafio da campanha.
- Há pontos de retorno adicionais em áreas seguras para os percursos mais longos.
- A curva é uma configuração inicial de design. Sua dificuldade percebida ainda precisa de partidas completas e feedback de jogadores.

Veja BALANCEAMENTO-CHECKPOINT3.md para tamanho, tempo e número de checkpoints de cada etapa.

## Vidas e Game Over
- Início com 5 vidas, definido em run.mjs.
- Dano mantém a sequência poder → SUPER → SMALL. Só a morte consome vida.
- Cair em buraco, morrer como Small ou esgotar o tempo consome exatamente uma vida.
- Com vidas restantes: retorno como Small ao checkpoint, com relógio completo e cenário restaurado, sem item automático.
- Com zero vidas: tela GAME OVER.
- O botão de nova tentativa restaura 5 vidas e recomeça a fase atual desde o início.
- Fases concluídas e desbloqueadas não são apagadas pelo Game Over.
- Vidas são guardadas na chave separada jarvis-adventure-run-v1. Reabrir o jogo não recarrega vidas automaticamente.
- O progresso anterior usa a mesma chave jarvis-skybound-v1, preservada.
- R mantém a ação anterior de reiniciar a fase do início, sem repor vidas. Entrar em outra fase também não repõe vidas.
- Reset progress continua pedindo confirmação e agora também prepara uma nova contagem de 5 vidas.

## Tempo
- Tempos configurados entre 300 e 480 segundos, conforme tamanho e presença de chefe.
- O objetivo é permitir exploração, espera por plataformas e aprendizado; não exigir uma execução precisa.
- O relógio só avança enquanto a partida está ativa. Pausa, tela de morte, Game Over e vitória congelam a contagem.
- Ao zerar, aparece TIME UP (ou Game Over na última vida), mesmo se Jarvis estiver invencível ou transformado.
- Cada tentativa após uma morte recebe o tempo integral da etapa, inclusive ao retornar a um CP.
- Vidas e tempo aparecem no canvas e na barra externa, facilitando leitura em telas menores.
- Não foi medido o tempo médio de jogadores em todas as fases. Os limites ainda podem ser ajustados após jogar os percursos completos.

## Arquitetura
- campaign.mjs: novas seções e aproximações dos chefes, tamanhos e tempos.
- run.mjs: configuração de vidas, validação do salvamento e operações de contador.
- layouts.mjs / levels.mjs: integração das seções, caixas e checkpoints.
- world.mjs: retorno sem criação de cogumelo; removido reabastecimento automático.
- items.mjs: ativação de uso único conforme o estado.
- game.mjs: vidas, contador, TIME UP, Game Over, pausa e integração.
- Nenhuma dependência adicional. A pasta src do portfólio permanece inalterada.

## Testes executados
- npm run build: passou. Avisos não bloqueantes do React Router e de sitemap permanecem da configuração do site.
- node scripts/test-jarvis.mjs: 33 grupos passaram.
- node scripts/test-jarvis-world.mjs: 13 grupos passaram.
- Total: 46 grupos, incluindo física, estados, animações, poderes, movimento de plataformas, armadilhas e progressão.
- Verificada ausência de itens automáticos nas 17 entradas e em todos os checkpoints.
- Verificadas caixas de uso único: cogumelo para Small, poder específico para grande, permanência vazia após uso e restauração ao recomeçar.
- Verificadas cinco mortes, desconto único por morte, zero vidas, Game Over, nova tentativa com cinco vidas e preservação dos desbloqueios.
- Verificados TIME UP com invencibilidade e transformação, retorno com tempo integral e ausência de desconto duplicado.
- Verificados congelamento do relógio na pausa e após vitória no ciclo real de frames, persistência e validação das vidas.
- Verificados tamanhos crescentes, limites generosos e ao menos duas caixas próximas dos pontos de retorno.
- Análise geométrica de todas as 17 etapas encontrou rotas para saída e checkpoints sem poder obrigatório. Essa análise considera alcance do salto e endpoints móveis; não equivale a jogar os obstáculos com seus tempos.
- Todas as etapas passaram por simulação curta e renderização das sete formas com DOM/canvas simulados.
- A primeira fase ampliada foi concluída por sequência de comandos normais em teste integrado, com inimigos/colisões ativos, confirmando vitória, desbloqueio e mais de 150 segundos restantes.

## Navegador real
- Página e mapa carregados com 5 vidas.
- Confirmada a primeira caixa liberando cogumelo como Small, coleta e crescimento para Super.
- Confirmada a caixa seguinte liberando Fire Flower como Super.
- A caixa anterior permaneceu vazia; não houve novo cogumelo automático no início.
- Realizadas cinco mortes por queda pelos controles normais: contador 5 → 4 → 3 → 2 → 1 → 0 e abertura de GAME OVER.
- Ao recarregar a página, o contador continuou em zero.
- Confirmado o botão de recomeço retornando a 5 vidas e 300 segundos na primeira fase.
- Consulta ao console após esses passos não retornou erros.
- Não foi necessário aguardar 300 segundos no navegador: expiração do tempo foi executada nos testes de integração.

## Validação manual pendente
- Jogar as outras 14 fases ampliadas e os dois novos percursos de aproximação dos chefes até o fim.
- Avaliar dificuldade gradual e tempos com jogadores. A configuração pretende dar ampla folga, mas não é uma medição de tempo médio.
- Touch simultâneo e leitura do HUD em celulares reais.
- Medição de desempenho em dispositivos reais; não há afirmação de 60 FPS medidos.
- Conferir a versão publicada no domínio depois do upload.

## Publicação
A integração GitHub recusou criação de branch com HTTP 403. Este checkpoint não foi enviado nem publicado por ela.

Extraia o ZIP e envie public, scripts, CHECKPOINT3.md, BALANCEAMENTO-CHECKPOINT3.md e JARVIS.md pela opção Add file → Upload files, na raiz do repositório. Salve com Commit changes e aguarde a Cloudflare terminar.
O ZIP contém apenas arquivos novos ou alterados. O portfólio continua na página inicial e o jogo em /jarvis/.
