# Checkpoint 4 — Coins & Castles

- Caixas de moedas distribuídas em trechos seguros. O prêmio é uma moeda, creditada após a animação, sem alterar a forma. Cada caixa funciona uma vez por tentativa.
- Reservas de poder concentradas no início e nos checkpoints: duas caixas permitem crescer e obter o poder da fase. As demais caixas oferecem moedas. Caixas se renovam após morrer.
- Cloud: três usos no total, sem recarga ao pousar, inclusive sobre nuvens. Outra Cloud flower restaura três cargas. Cada nuvem dura quatro segundos.
- A forma ao concluir uma fase fica salva no dispositivo e vale na próxima fase selecionada, inclusive depois de reabrir. Cloud entra com três cargas. Morte e Game Over continuam retornando Small.
- Mapa com torre e castelo desenhados nos destinos dos bosses, preservando bloqueios e navegação.
- Interiores distintos com alvenaria, janelas, colunas, tochas e bandeiras no castelo.
- Lagos de lava nos vãos do castelo final. Contato mata imediatamente qualquer forma, ignorando a invencibilidade temporária. Plataformas e trilhos existentes permitem atravessar sem poder obrigatório. Arena do boss e checkpoints ficam em chão seguro.

## Verificação
37 grupos de testes do jogo e 13 de mecânicas passaram (50). Incluem moedas de uso único, limite e recarga de nuvem, persistência de todas as formas e morte na lava para todas as formas. Compilação do site passou. Prévia visual dos dois interiores e mapa sem erros de console. A primeira fase foi concluída por uma sequência de comandos normais no teste automatizado; não houve uma nova partida humana completa das 17 etapas.

## Instalação
Extraia jarvis-checkpoint-4-completo.zip em uma pasta nova. Envie public, scripts, CHECKPOINT4.md e JARVIS.md diretamente na raiz do repositório, depois Commit changes. Aguarde a publicação verde e abra /jarvis/ com Ctrl+F5. O cabeçalho é CHECKPOINT 4 · COINS & CASTLES. Não precisa apagar o progresso. O pacote traz a pasta inteira do jogo para evitar mistura de versões. Nada foi publicado automaticamente.
