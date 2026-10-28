# Checkpoint 10 — Green Valley

## Entrega
O jogo mantém um único mundo com 15 fases regulares, uma torre e o castelo final, na mesma ordem. O nome visível do mundo passa a ser Green Valley. Não há migração nem necessidade de apagar o progresso.

## Novo mapa
O mapa ganhou caminho sinuoso, colinas, montanhas, vale, rio, ponte do aqueduto, entrada de caverna junto à Crystal Cavern, picos nevados e uma região de fornalhas. Torre e castelo têm silhuetas próprias e ficam afastados dos nomes das fases.
O trajeto usa curvas quadráticas compartilhadas pelo desenho e pelo movimento de Jarvis. As setas escolhem os destinos adjacentes pela direção visual, respeitando os desbloqueios. A fase atual tem um anel de seleção; fases disponíveis, concluídas e bloqueadas mantêm identificação distinta. Clique, Espaço e botões de toque continuam disponíveis.
Em telas estreitas, o mapa mantém uma largura legível e permite rolagem horizontal, acompanhando a posição selecionada de Jarvis. A página continua permitindo rolagem vertical para visualizar todo o percurso.

## Carregar cascos
- Pise no inimigo de casco para recolhê-lo.
- **E/J:** pega um casco parado próximo, sem precisar congelar. Pressionar novamente o solta, sem velocidade horizontal.
- **X/K:** lança o casco na direção de Jarvis, com pequeno impulso vertical; ao pousar, ele continua deslizando e rebate nas paredes.
- Caminhar e saltar carregando continuam funcionando, com as mesmas verificações de paredes, tetos, elevadores e bordas usadas para gelo.
- Só é possível carregar um objeto por vez: casco ou inimigo congelado.
- Não é possível pegar um casco deslizando, um inimigo andando ou um objeto congelado já lançado.
- O casco carregado não machuca Jarvis. Depois do lançamento, há proteção inicial breve; no retorno, ele pode causar dano normalmente.
- Pisão continua parando o casco e contato lateral continua chutando um casco parado. E/J é processado antes da colisão de contato para permitir pegá-lo.
- Casco lançado não causa dano aos chefes: ao tocar neles, é removido.
- Dano solta com segurança; quando não há espaço, remove o objeto para evitar sobreposição. Morte, saída, reinício, Game Over e conclusão limpam a referência. Objetos carregados não são salvos ou transferidos entre fases.
- Um casco congelado continua obedecendo às regras de gelo. O novo transporte sem gelo não muda o gelo deslizante.
- O botão GRAB de toque e a descrição dos controles agora incluem cascos.

## Espaço após concluir uma fase
A tela de conclusão informa: “Click to continue or press Space.” O botão e Espaço executam a mesma ação de voltar ao mapa.
Se Espaço estiver pressionado ao concluir a fase, é necessário soltá-lo e pressioná-lo novamente. Repetições automáticas são ignoradas. Após confirmar pelo teclado, a entrada em outra fase fica bloqueada até soltar a tecla. Um novo pressionamento no mapa volta a funcionar normalmente. A regra também vale para a conclusão do castelo final.
Os controles de salto durante a partida, pausa e entrada nas fases foram preservados.

## Verificações realizadas
- **110 grupos passaram:** 71 do jogo e integração, 13 de mecânicas de cenário, 13 de gelo e 13 de inimigos/correções do Checkpoint 9.
- Novos testes cobrem pegar e soltar casco sem gelo; arremesso com prioridade sobre o poder atual; recusa de cascos em movimento; limpeza no dano e saídas; imunidade dos chefes; confirmação única com Espaço nas fases comuns e no castelo; tecla mantida, repetição e mouse; curvas reversíveis; acesso a todos os destinos adjacentes e preservação de bloqueios.
- Permanecem os testes anteriores de física, poderes, vidas, moedas, checkpoints, Game Over, blocos, inimigos, gelo deslizante, chefe final e oito travessias obrigatórias de nuvem.
- Compilação do portfólio concluída. Permanecem avisos anteriores do React Router sobre diretivas use client ignoradas e sitemap adiado por falta de domínio na configuração.
- No navegador, em cena local de teste, E pegou um casco sem gelo, K o lançou e ele entrou em deslizamento. Espaço confirmou a tela de conclusão e deixou o jogo no mapa, sem entrar em outra fase.
- O mapa foi inspecionado visualmente em largura de desktop e em uma janela incorporada com 390 pixels de largura. Foram conferidos percurso, nomes, torre, castelo, legibilidade e centralização horizontal de Jarvis.
- As cenas de acesso rápido e invulnerabilidade usadas na validação foram retiradas da pasta pública e não estão no ZIP. Não houve partida humana completa das 17 fases nem teste em celular físico. A validação em largura estreita verifica o layout, não substitui a avaliação do toque no aparelho.

## Checklist rápido para apresentação
1. **Mapa:** confira Green Valley, curvas, rio, caverna, montanhas, torre e castelo. Use as setas para caminhar e Espaço para entrar. Em tela estreita, deslize o mapa horizontalmente.
2. **Treetop Trail — fase 2:** encontre o inimigo de casco. Pise, aproxime-se, E para pegar, caminhe, salte e J para soltar. Pegue novamente e lance com X ou K. Confira ricochete e novo pisão para parar.
3. **Emberworks — fase 10:** teste carregar casco e gelo em tentativas diferentes; só um objeto pode ser transportado por vez.
4. **Conclusão de qualquer fase:** pressione Espaço para voltar ao mapa. Mantenha Espaço durante o salto final e confira que a mensagem só avança depois de soltar e pressionar novamente.
5. **Castelo final:** confira a mesma confirmação por Espaço após derrotar o chefe.
6. Confira rapidamente vida, moedas, checkpoint e poder salvo. O progresso antigo deve continuar disponível.

## Instalação pelo navegador do GitHub
1. Extraia **jarvis-checkpoint-10-completo.zip** em uma pasta nova.
2. Na raiz do repositório ThalesXavier-Lab, abra **Add file > Upload files**.
3. Envie diretamente os quatro itens: **public**, **scripts**, **CHECKPOINT10.md** e **JARVIS.md**. Não envie o ZIP fechado nem a pasta que contém esses itens.
4. Clique em **Commit changes** e aguarde a publicação da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e pressione Ctrl+F5.
6. Confirme **CHECKPOINT 10 · GREEN VALLEY** no cabeçalho.

O ZIP inclui todos os arquivos de public/jarvis e os quatro scripts de testes, totalizando 25 arquivos. O portfólio em src, as dependências e a hospedagem foram preservados. Esta entrega prepara os arquivos; ainda não foi publicada no domínio.
