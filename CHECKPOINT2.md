# Jarvis Adventure — Checkpoint 2
Base publicada: commit 76ac3d5bcd3cd5c9cfe3b1e18e882d0b1ab72807 do ThalesXavier-Lab.

## O que mudou
As 15 fases regulares deixaram de usar um único laço que repetia plataformas e intervalos. Cada fase agora tem um layout definido individualmente, uma identidade, uma mecânica principal, instruções no cenário, encontros posicionados e um ponto de retorno escolhido em terreno seguro.

A matriz completa está em MATRIZ-FASES-CHECKPOINT2.md.

Foram preservados o personagem, crescimento, formas especiais, física, blocos, moedas, mapa, ordem das fases, desbloqueio e a chave de progresso jarvis-skybound-v1. Quem já terminou o jogo continuará vendo todas as etapas abertas. A torre continua após a oitava fase; o castelo permanece ao final.

As plataformas, chefes, inimigos, dimensões e objetivos das duas arenas de chefe foram comparados com o Checkpoint 1 e permaneceram iguais. A nova restauração dos mecanismos e os checkpoints explícitos também se aplicam às arenas.

## Mecânicas implementadas
- Plataformas móveis horizontais e diagonais, que transportam Jarvis com uma rota pontilhada visível.
- Contato lateral ou por baixo interrompe/inverte a plataforma. Se transportar Jarvis causaria colisão com parede ou teto, o movimento é desfeito e invertido; não há dano por esmagamento neste checkpoint.
- Plataformas temporárias: prontas → tremendo → queda → espera → retorno. O retorno espera se o personagem ocupar o espaço de origem.
- Obstáculos fixos de espinhos e armadilhas periódicas. Vents usam repouso escuro, aviso dourado e ativação vermelha, com ciclo previsível.
- Travessias verticais, túneis baixos, rotas em vários níveis, pistas de frenagem no gelo e combinações das mecânicas.
- Super pode agachar e se deslocar lentamente por túneis usando Baixo + direção. Small pode caminhar por eles.
- Blocos de poder reutilizáveis nas fases regulares: oferecem cogumelo para Small e o poder configurado para formas grandes. Reabastecem após a coleta ou perda do item; evitam acumular itens próximos sem coleta.
- Rotas com poderes são opcionais: o caminho para concluir cada fase não exige conservar um poder específico.
- Bandeiras CP visíveis. São ativadas ao passar sobre a plataforma correta na altura configurada, não apenas ao alcançar metade da largura.
- Morrer e tentar de novo recria a fase, reinicia ciclos/plataformas/blocos e reaparece como Small no CP alcançado, com um cogumelo disponível.
- Moedas e patrulhas foram distribuídas conforme cada percurso, com diferenças de altura, posição, direção e velocidade.

## Organização
- layouts.mjs: 15 layouts e matriz de design, sem geração por um padrão uniforme.
- levels.mjs: seleção da fase e arenas de chefe preservadas.
- world.mjs: plataformas móveis/temporárias, ciclos, pontos de retorno e reabastecimento.
- physics.mjs: lista compartilhada de sólidos para movimento, itens e crescimento seguro.
- player.mjs, items.mjs, game.mjs: integração com as mecânicas existentes.
- rendering.mjs: trajetórias, plataformas, perigos, bandeiras e instruções.
- Nenhuma dependência adicional, backend, sistema completo de vidas, mundo ou chefe foi introduzido.
- O portfólio e os arquivos da pasta src permanecem inalterados.

## Verificações efetivamente executadas
### Compilação e testes automatizados
- npm run build: passou. Avisos não bloqueantes de React Router e sitemap são da configuração existente.
- node scripts/test-jarvis.mjs: 26 grupos passaram.
- node scripts/test-jarvis-world.mjs: 13 grupos passaram.
- Total: 39 grupos, incluindo os testes anteriores de estados, tamanho, salto, corrida, dano, invencibilidade e cinco habilidades.
- Verificados transporte horizontal/diagonal, teto bloqueando uma plataforma, contato lateral, queda/retorno e retorno bloqueado por personagem.
- Verificados estados e reset dos perigos, colisão/dano real das armadilhas, ativação de CP por altura e restauração após morte na integração do jogo.
- Verificados reabastecimento, cogumelo seguido de poder especial, ausência de blocos dentro do terreno e ausência de inimigos/perigos próximos dos pontos de reaparecimento.
- A geometria das 17 etapas foi analisada individualmente por um grafo de saltos calculado com a física configurada. Endpoints de plataformas móveis se conectam por arestas de transporte. Foram encontrados caminhos para saída e checkpoints sem usar poder especial.
- Essa verificação geométrica não simula todas as janelas de tempo, os inimigos ou cada obstáculo durante uma partida.
- A primeira fase foi completada por uma sequência de comandos normais no teste de integração: sem teletransporte, sem invencibilidade extra, com inimigos e colisões ativos. Confirmou vitória, persistência e liberação da segunda fase.
- As 17 etapas também passaram por carregamento/simulação curta e chamadas de renderização nas sete formas usando canvas/DOM simulados.
- Comparação separada confirmou preservação das arenas de chefe em relação ao Checkpoint 1.

### Navegador real
- A versão normal carregou o mapa e a primeira fase; foram percorridos trechos até a ativação do CP.
- Inspeção revelou interferência de um teto opcional no impulso inicial; a geometria foi ajustada e um teste de salto real foi adicionado.
- Todas as 17 etapas foram abertas individualmente em uma página local de inspeção, aguardando o início efetivo de cada fase e consultando o console: nenhum erro JavaScript foi registrado nessas aberturas.
- Inspeção visual de exemplos: primeira fase, subida nas árvores, aqueduto, caverna, plataformas temporárias, fornalhas e skyrail.
- No aqueduto, Jarvis embarcou e foi transportado por uma plataforma usando os controles normais.
- O estado ativo de uma fornalha e a sinalização de perigos foram inspecionados.
- O seletor local apenas permite abrir fases sem jogar a campanha. Ele não altera as regras dos mecanismos e não está no ZIP nem no código entregue.
- Carregar/inspecionar uma etapa não equivale a completá-la. Não foi feita uma partida completa nas 15 fases pelo navegador.

## O que ainda precisa de validação manual
- Partida completa nas outras 14 fases e nos dois chefes, incluindo transferências mais avançadas.
- Avaliação de ritmo, legibilidade das instruções, dificuldade e margem dos saltos por jogadores.
- Touch simultâneo, telas pequenas e diferentes navegadores em celulares reais.
- Medição de FPS em dispositivos reais. Não foi confirmado desempenho de 60 FPS por medição.
- Publicação no domínio e conferência dos arquivos após o envio.

## Atualização pelo GitHub no navegador
A integração voltou a recusar criação de branch com HTTP 403. Este checkpoint não foi enviado nem publicado por ela.

1. Extraia o ZIP jarvis-checkpoint-2.zip.
2. Abra a raiz do ThalesXavier-Lab e escolha Add file → Upload files.
3. Envie as pastas public e scripts, e os arquivos CHECKPOINT2.md, MATRIZ-FASES-CHECKPOINT2.md e JARVIS.md.
4. Envie esses itens diretamente, não a pasta externa nem o ZIP fechado.
5. Salve em Commit changes e aguarde o build verde da Cloudflare.
6. Abra seu domínio seguido de /jarvis/ e atualize com Ctrl+F5.

O ZIP contém somente arquivos novos ou alterados desde o Checkpoint 1. Todos devem ser enviados juntos.
