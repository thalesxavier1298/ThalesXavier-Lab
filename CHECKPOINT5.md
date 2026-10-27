# Checkpoint 5 — Walk the Cloud Trail

## Mudanças
- Jarvis visível no mapa, movimento animado pelas setas ao longo dos caminhos desbloqueados. Espaço entra no destino atual; a tecla de entrada não provoca um salto. Mouse continua entrando diretamente nas fases. Botões de direção e entrada oferecem a mesma navegação por toque. O retorno ao mapa conserva o destino da fase; ao reabrir, usa o último destino salvo. Primeira visita sem dados começa no primeiro destino.
- Mapa mais espaçoso, torre redesenhada acima do Sentinela e castelo redesenhado à frente do destino final. Os monumentos não cobrem nomes. Em tela estreita, há rolagem horizontal do mapa, acompanhando o personagem durante o deslocamento.
- Uma caixa de poder por ponto, com a próxima afastada. Checkpoints não têm pares. Somente a preparação imediata dos bosses admite duas próximas. As demais caixas continuam oferecendo moedas; todas permanecem de uso único por tentativa.
- Fases de nuvem 4, 5, 9 e 15 ganharam respectivamente 1, 2, 2 e 3 travessias obrigatórias na rota principal. Os vãos medem 560, 600 ou 640 unidades. A fase 15 combina vãos com aterrissagens mais altas. Tempos dessas fases foram ampliados em 100 segundos por travessia.
- Cada desafio tem checkpoint seguro e duas reservas separadas por 280 unidades, permitindo cogumelo e depois flor se Jarvis chega pequeno. Outra forma recebe nuvem ao coletar a flor. O limiar CLOUD PASS exige nuvem antes da travessia.
- Cada travessia passou no integrador real com duas nuvens, deixando uma terceira de reserva. Não há recarga por pousar. Há novas flores antes do desafio seguinte.
- C ou Retry cloud trial reinicia o desafio alcançado, restaurando caixas, relógio e posição segura, sem descontar vida. Jarvis volta pequeno e pode coletar os suprimentos novamente. Quedas continuam descontando vida normalmente.
- Preservados os 17 destinos, progresso salvo anterior, forma ao concluir fases, vidas, Game Over, lava e interiores de torre/castelo.

## Verificação realizada
- 41 grupos de testes do jogo e 13 das mecânicas passaram (54 no total).
- Testes novos: caminhos e curvas do mapa, bloqueios, proteção contra movimento duplo e entrada durante deslocamento, retorno de fase e entrada sem salto involuntário; espaçamento de caixas; oito travessias com comandos do jogo e física real, usando exatamente duas cargas; salto comum insuficiente; suprimentos para Small e outras formas; reinício dos desafios e restauração das caixas.
- Testes anteriores de poderes, dano, persistência, cinco vidas, Game Over, temporizador e lava continuam passando.
- Compilação do portfólio concluída. Avisos já existentes do React Router e de sitemap sem domínio configurado permanecem.
- Conferência no navegador: mapa largo e estreito, monumentos e personagem; seta do teclado, entrada com Espaço, retorno ao mapa, botão de direção e botão de recuperação. Sem erros de console nas páginas conferidas. Prévia do desafio usou uma cena de teste local para acessar o checkpoint, excluída do pacote.
- Não houve nova partida humana completa das 17 etapas nem teste em aparelho móvel real. O equilíbrio e a clareza das instruções ainda devem ser avaliados jogando.

## Instalação pelo GitHub
1. Extraia jarvis-checkpoint-5-completo.zip em uma pasta nova.
2. Na raiz de ThalesXavier-Lab, use Add file > Upload files.
3. Envie diretamente os quatro itens: public, scripts, CHECKPOINT5.md e JARVIS.md. Não envie a pasta externa nem o ZIP fechado.
4. Clique Commit changes. Aguarde a publicação verde da Cloudflare.
5. Abra seu domínio em /jarvis/ e pressione Ctrl+F5.
6. Confira o título CHECKPOINT 5 · WALK THE CLOUD TRAIL.

O pacote contém a pasta inteira do jogo, os testes e estes documentos. Não modifica src ou a página inicial do portfólio. Não é necessário apagar progresso. Nada foi publicado automaticamente: o envio continua pelo navegador do GitHub, como nas versões anteriores.

## Testes sugeridos ao jogador
- Setas no mapa, curvas entre linhas, Espaço para entrar e retorno ao mesmo destino.
- Verificar nomes livres atrás dos monumentos.
- Caixas de poder espaçadas, sem pares nos checkpoints.
- Na fase 4, seguir até CLOUD TRIAL; coletar cogumelo e flor nos dois pontos separados. Saltar, criar nuvem perto do ponto alto, pousar, saltar de novo. X usa poder; Shift corre.
- Repetir nas fases 5, 9 e 15, que têm mais sequências. Se gastar cargas incorretamente antes de cair, usar C ou Retry cloud trial e verificar que não perdeu vida.
