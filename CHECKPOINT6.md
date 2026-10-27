# Checkpoint 6 — Extra Lives & Rivals

## O que mudou

### Game Over e pausa
A tela de Game Over oferece Return to world map: volta ao mapa com cinco vidas, sem abrir uma fase automaticamente, preservando desbloqueios e saldo de moedas. Jarvis volta pequeno na próxima tentativa.
O menu de pausa oferece Quit level — World map. Sair não custa vida e descarta o checkpoint. A reentrada começa do início, com relógio e mecanismos novos. A forma salva continua sendo a da última fase concluída; sair não grava uma nova transformação como conclusão.

### Moedas e vida extra
Moedas do cenário e das caixas entram no mesmo contador persistente. Cada 50 concede uma vida, descontando 50 e preservando excedentes. O HUD mostra o saldo /50. Morte, saída pela pausa e Game Over preservam o saldo. Fechar e reabrir preserva saldo e vidas. Salvamentos antigos recebem saldo zero e mantêm progresso e forma válidos. Vidas acima de cinco são aceitas; o teto de exibição/validação é 999. Aviso 1-UP e som (quando habilitado) anunciam a vida extra.

### Cogumelo verde
Cada uma das 17 etapas tem um bloco de cogumelo verde, alcançável por Small Jarvis. O cogumelo se move, cai e rebate; é preciso coletá-lo para ganhar a vida. Não troca forma ou poder.
A coleta é registrada por fase e permanece registrada após morte, reinícios, saída, Game Over e reabertura. O bloco fica gasto nas novas tentativas até concluir aquela fase. A conclusão libera a recompensa para uma nova passagem futura. Perder o item sem coletar permite tentar novamente. Reset progress é um reset explícito que também limpa moedas e esses registros.

### Inimigos
O básico permanece. Novos tipos têm aparências originais:
- Ember scout: atirador de fogo, com aviso antes do disparo; uma pancada o derrota.
- Iron thrower: lança martelos em arco e suporta duas pancadas comuns; o martelo de Jarvis causa dois pontos de dano.
- Leaper: patrulha, salta e dispara fogo; suporta duas pancadas comuns.
- Carnivorous bud: alterna períodos recolhida e aberta. Pode ser atravessada recolhida; aberta exige esquiva ou ataque à distância. Pisão direto na planta aberta machuca Jarvis. Gelo permite congelar e depois tocar para quebrar.
Tipos resistentes piscam após tomar dano. Inimigos congelados param de agir. Ataques têm intervalos, duração e limite de projéteis; novos projéteis somem no terreno. Ataques de fogo comuns são horizontais; martelos fazem arco. Posições de checkpoints e travessias obrigatórias de nuvem ficam preservadas.
O primeiro nível mantém apenas os básicos. Fogo aparece cedo; plantas, martelos e saltadores entram ao longo da campanha. Não há todos os tipos em cada fase.

### Storm King
O Sentinela mantém seu combate intermediário com seis pontos de vida. O Storm King tem 14, três patamares de intensidade, três posições de aterrissagem e saltos anunciados. A fase 2 acrescenta martelos; a fase 3 acelera os saltos. Um marcador indica a aterrissagem, seguido por janela de recuperação para contra-ataque. A arena inclui duas plataformas elevadas e dois vãos com lava. A câmera cobre a arena final. Pisões e projéteis continuam funcionando; a bandeira só conclui a fase após derrotá-lo.
A trajetória primeiro ganha altura, atravessa e depois desce para evitar atravessar as plataformas. As duas caixas de poder de preparação ficam antes da arena.

## Verificação
- 51 grupos de testes do jogo e 13 de mecânicas passaram: 64 no total.
- Novos testes verificam moedas 20+20+10, excedente, salvamento e migração; moedas após morte; Game Over no mapa; saída pela pausa com descarte do checkpoint; verde sem alterar as sete formas; registro de coleta e liberação ao concluir; bloqueio de repetição por reinício; os 17 blocos atingíveis por Small com o integrador real; novos ataques, avisos, congelamento, resistência, projéteis e expiração; três aterrissagens do boss e ausência de sobreposição com plataformas; intensificação, pisões, projéteis e conclusão; percurso da arena por Small usando saltos normais.
- Oito travessias obrigatórias de nuvem e os testes anteriores continuam passando.
- Compilação do portfólio concluída. Permanecem avisos anteriores do React Router e sitemap sem domínio configurado.
- Navegador: conferidos menu de pausa e sua saída; Game Over retornando ao mapa com cinco vidas e saldo preservado; aviso de vida por moedas; surgimento e coleta do cogumelo verde por comandos normais; visuais dos rivais e arena final. Sem erros de console nas cenas inspecionadas.
- A prévia usou botões locais para acessar cenas e, em algumas cenas, proteção temporária para inspeção. Esses controles e cenários de teste não fazem parte do ZIP.
- Não houve partida humana completa das 17 fases nem vitória humana completa no novo boss final. Os testes de dano e conclusão do boss usam cenas controladas; a simulação comprova movimento e acesso à arena, mas não substitui uma avaliação humana do equilíbrio. Não houve teste em celular físico ou medição formal de desempenho.

## Instalação
1. Extraia jarvis-checkpoint-6-completo.zip em uma pasta nova.
2. Na raiz do repositório ThalesXavier-Lab, escolha Add file > Upload files.
3. Envie os quatro itens diretamente: public, scripts, CHECKPOINT6.md e JARVIS.md. Não envie o ZIP fechado nem a pasta externa.
4. Clique Commit changes e espere a publicação verde da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e pressione Ctrl+F5.
6. O cabeçalho deve mostrar CHECKPOINT 6 · EXTRA LIVES & RIVALS.

O ZIP contém toda a pasta do jogo, os dois scripts de testes e os documentos. O portfólio e src permanecem preservados; não é necessário limpar progresso. Nada foi publicado automaticamente: este pacote segue o fluxo de upload manual já utilizado.

## Validação recomendada ao jogador
- Pausar, sair, reentrar e conferir início da fase.
- Game Over, confirmar retorno ao mapa, conferir cinco vidas e moedas preservadas.
- Somar moedas em fases diferentes até ganhar vida; reabrir o jogo antes/depois da recompensa.
- Coletar um cogumelo verde; reiniciar e conferir que não reaparece até concluir aquela fase.
- Observar fogo, martelos, saltadores e plantas; procurar ataques inevitáveis ou inimigos presos.
- Confrontar o Sentinela e depois o Storm King. Conferir marcador, saltos, três posições, fases de intensidade, oportunidades de atacar e riscos da arena. Relatar se o equilíbrio precisa de ajuste.
