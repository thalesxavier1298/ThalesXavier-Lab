# Jarvis Adventure
Checkpoint 3 — caixas de uso único, fases ampliadas, vidas e tempo.

Consulte CHECKPOINT3.md para regras, testes e limitações.
BALANCEAMENTO-CHECKPOINT3.md lista os tamanhos, tempos e pontos de retorno.
Os documentos dos checkpoints anteriores são históricos; regras de caixas e cogumelos foram substituídas nesta atualização.

## Executar
npm ci
npm run dev
npm run build
node scripts/test-jarvis.mjs
node scripts/test-jarvis-world.mjs

## Controles
Setas/A/D: mover. Shift: correr. Space/W/Acima: pular.
Baixo/S + direção: rastejar como personagem grande.
X/K: poder. P/Escape: pausa. R: reiniciar fase do início, mantendo o número atual de vidas.

## Itens
Cada caixa só fornece um item por tentativa.
Small recebe cogumelo. Formas grandes recebem o poder da fase.
Não há cogumelo automático. Morte e nova tentativa recriam as caixas no cenário.

## Vidas e tempo
5 vidas iniciais. Morte consome uma vida; Game Over permite recomeçar a fase com 5 vidas sem apagar desbloqueios.
Tempo por fase: 300 a 480 segundos. Pausa congela o relógio; nova tentativa após morrer recebe o tempo completo.
Vidas são salvas separadamente do progresso antigo. Os limites e o número inicial podem ser ajustados em campaign.mjs e run.mjs.
