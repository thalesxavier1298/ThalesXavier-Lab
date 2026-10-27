# Jarvis Adventure — Checkpoint 1
Base: ThalesXavier-Lab, commit 67a22791f57da95541931301ea0c84e119cf767e.

## Implementado
- Preservadas as 15 fases regulares, a torre e o castelo, os chefes, inimigos, moedas, destinos e chave de progresso jarvis-skybound-v1.
- Pixel art original desenhada por máscaras de pixels, sem assets comerciais. Jarvis com poses/quadros de idle, caminhada, corrida, salto, queda, aterrissagem, agachamento, dano, morte e transformação.
- Quatro paletas de cenário, fundos em camadas com parallax, terreno com tiles, bordas, vegetação, blocos e efeitos em grade de pixels. Sem interpolação de sprites.
- Caminhada, corrida com Shift, aceleração, desaceleração, inversão de direção e atrito menor no tema frost.
- Salto variável, coyote time de 100 ms, jump buffer de 100 ms. Simulação fixa a 120 Hz, com desenho por requestAnimationFrame.
- Colisão por eixos com subpassos espaciais de até 4 unidades para reduzir atravessamento em boosts.
- SMALL (24x28), SUPER e cinco formas especiais (24x48). Agachamento reduz a altura para 28.
- Crescimento mantém os pés; se houver teto, a transformação fica pendente até existir espaço. Jarvis não se levanta de um agachamento dentro de teto.
- Super Mushroom emerge, cai, caminha, rebate nas paredes e cai das plataformas.
- Os três pontos de poder originais de cada fase agora têm blocos configurados com o mesmo poder. Small recebe cogumelo; formas grandes recebem o poder do bloco. Um cogumelo inicial permite experimentar crescimento logo no começo e após um checkpoint.
- Super e formas especiais quebram o bloco de tijolo adicionado perto do início. Small apenas o atinge.
- Dano: especial → SUPER → SMALL → animação de morte e tentativa novamente. Invencibilidade configurável de 1,6 s; controle continua ativo.
- As cinco habilidades existentes foram mantidas: projéteis de fogo, gelo, martelo, plataformas de nuvem e impulso/queda lenta de helicóptero.
- Botões de toque de corrida e agachamento adicionados aos controles existentes.
- Sem novas dependências, backend, mundos, chefes ou sistema completo de vidas.

## Arquitetura
- game.mjs: ciclo, mapa, combate, HUD, sons e integração dos sistemas existentes.
- levels.mjs: fases e configuração de blocos, mantendo os layouts existentes.
- config.mjs: estados, dimensões e constantes ajustáveis.
- physics.mjs: colisões, redimensionamento seguro e aceleração.
- player.mjs: movimento, dano, transformações e seleção de animação.
- items.mjs: cogumelos, coleta e conteúdo dos blocos.
- sprites.mjs: máscaras e desenho original de Jarvis e itens.
- rendering.mjs: cenário em camadas, terreno e blocos.
- scripts/test-jarvis.mjs: testes executáveis sem dependências adicionais.

## Efetivamente executado
- npm run build: passou. Os avisos não bloqueantes de React Router e o aviso de sitemap já fazem parte da configuração existente.
- node scripts/test-jarvis.mjs: 22 grupos passaram.
- Testes de estados, dimensões, pés ancorados, crescimento bloqueado por teto, saída de agachamento, dano em cada forma, invencibilidade e controle.
- Testes de caminhada/corrida, aceleração, atrito, inversão, altura variável, distância de corrida, coyote time, jump buffer e ausência de segundo salto acidental.
- Testes de colisão em velocidade elevada, chão estável e plataformas de nuvem.
- Testes de blocos adaptativos, cogumelo emergindo, gravidade, movimento, parede, queda e coleta.
- Testes integrados do jogo com DOM/canvas simulados: cinco habilidades, tijolo, chefes bloqueando saída, vitória, salvamento, pausa, morte, nova tentativa, carregamento e renderização das 17 etapas nas sete formas.
- Comparação executada contra o levels.mjs publicado: plataformas, inimigos, chefes, moedas, pickups configurados, nomes, larguras e objetivos das 17 etapas preservados exatamente; blocos são adições.
- Navegador real: mapa, início SMALL, deslocamento, coleta de cogumelo, crescimento para SUPER, bloco atingido por baixo e coleta CLOUD. Renderização de cenário e sprites inspecionada.
- Consulta de erros do navegador após esses passos: lista vazia.

## Ainda requer validação manual
- Jogar as 17 etapas do começo ao fim, incluindo ambos os chefes.
- Avaliar conforto das animações, dificuldade e ritmo com jogadores.
- Touch simultâneo em celulares reais e diferentes sistemas/navegadores.
- Medir FPS em dispositivos reais; não foi feita medição de 60 FPS.
- Testar áudio ligado e permissões de som em navegadores móveis.
- Confirmar a publicação no domínio após envio dos arquivos.

## Publicação
A integração GitHub continua recusando escrita (HTTP 403). Nenhum arquivo deste checkpoint foi enviado ao repositório ou publicado.
O ZIP contém somente as pastas public e scripts, além desta documentação e JARVIS.md. Extraia e envie esses itens para a raiz do repositório usando Add file → Upload files. Não envie o ZIP fechado.
O portfólio continua na página inicial; o jogo permanece em /jarvis/.
