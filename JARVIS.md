# Jarvis Adventure
Jogo original de plataforma em /jarvis/, integrado ao portfólio.

## Checkpoint atual
Checkpoint 2: 15 percursos definidos individualmente, mecanismos móveis e temporários, armadilhas e checkpoints explícitos.
Consulte CHECKPOINT2.md para testes e limitações; MATRIZ-FASES-CHECKPOINT2.md descreve cada fase.
CHECKPOINT1.md mantém o histórico dos sistemas de personagem.

## Rodar e verificar
npm ci
npm run dev
npm run build
node scripts/test-jarvis.mjs
node scripts/test-jarvis-world.mjs

O build copia public/jarvis para dist/jarvis. Nenhuma dependência nova.
O portfólio continua na raiz; o jogo em /jarvis/.

## Controles
Setas ou A/D: mover. Shift: correr. Space, W ou Acima: pular.
Baixo/S + direção: agachar e rastejar quando grande.
X/K: poder. P/Escape: pausa. R: reiniciar a fase.

## Progresso e retorno
A chave jarvis-skybound-v1 permanece compatível. Fases concluídas e desbloqueios ficam salvos neste dispositivo.
Bandeiras CP registram retorno durante a tentativa atual. Morte restaura fase e mecanismos no CP alcançado.
Sair da fase ou usar R recomeça a fase do início; não há salvamento permanente da posição dentro dela.

## Leitura dos percursos
Azul: plataforma móvel com trajeto pontilhado.
Âmbar: plataforma temporária, que treme antes de cair e depois retorna.
Armadilhas: repouso escuro, aviso dourado, ativação vermelha.
Blocos ? reutilizáveis fornecem cogumelo a Small e o poder configurado a formas grandes.
Os poderes favorecem desvios opcionais; a rota principal não depende de conservar uma transformação.
