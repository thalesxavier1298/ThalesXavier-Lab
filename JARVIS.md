# Jarvis Adventure

Jogo de plataforma original integrado ao portfólio em /jarvis/.
Confira CHECKPOINT1.md para mudanças, arquitetura, testes executados e limites de validação.

## Executar
npm ci
npm run dev

Abra /projects e use Play Jarvis, ou visite /jarvis/ no endereço local.
npm run build gera o site incluindo public/jarvis em dist/jarvis.
node scripts/test-jarvis.mjs executa os testes de física e integração.

## Controles
Setas ou A/D: mover. Shift: correr. Space, W ou seta acima: pular.
Segurar pulo aumenta a altura. S ou seta abaixo: agachar.
X ou K: poder. P ou Escape: pausa. R: reiniciar a fase.
Há controles de toque para mover, correr, agachar, pular e usar poder.

## Progressão
15 fases, torre intermediária e castelo final.
A chave de progresso anterior é preservada. Início e novas tentativas começam SMALL.
Cogumelo cresce para SUPER. Blocos ? fornecem cogumelo quando pequeno e o poder configurado quando grande.
Dano: poder → SUPER → SMALL → nova tentativa. Não há um sistema de vidas completo neste checkpoint.
