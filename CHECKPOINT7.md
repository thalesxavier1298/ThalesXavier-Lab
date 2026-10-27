# Checkpoint 7 — Blocks & Surprises

## Mudanças

### Hammer Flower
O item tem agora uma silhueta própria: cabeça metálica larga, cabo estreito e folhas laterais. É visualmente diferente da flor redonda de gelo, inclusive sem depender da cor. O nome na ajuda passa a Hammer flower. A transformação e os martelos lançados continuam funcionando como antes.

### Sentinela da torre
Fire e Hammer causam dano por projéteis. Ice não tira vida nem congela o Sentinela. O projétil de gelo desaparece ao tocar nele, com efeito de impacto e aviso de resistência. Pisões e intervalo de proteção entre acertos continuam funcionando. A regra de projéteis do Storm King não foi alterada.

### Blocos invisíveis
Há blocos opcionais de moeda nas fases 1 (Dewdrop Meadow), 6 (Crystal Cavern), 10 (Emberworks) e 13 (Skyrail Summit). Uma moeda isolada e uma pista no cenário indicam a posição. Não há poderes obrigatórios escondidos nesses blocos.
Antes da revelação não bloqueiam movimento lateral, quedas ou crescimento. Um salto que atinge a face inferior revela o bloco, interrompe o movimento da cabeça com segurança e libera uma moeda uma única vez por tentativa. Depois ficam visíveis e sólidos. A ativação é adiada se houver inimigo, item ou plataforma móvel sobrepondo a área, para não prender objetos. São reiniciados na próxima tentativa, como os demais blocos comuns.
O sistema de segredos, saídas secretas e colecionáveis especiais permanece para outra etapa.

### Inimigos sobre blocos
Uma pancada por baixo afeta somente os inimigos realmente apoiados sobre aquele bloco. O impacto não se repete durante a animação. Afeta caixas cheias, caixas gastas e tijolos.
Inimigos comuns recebem dano; resistentes seguem seus pontos de vida e piscam durante a proteção temporária. Sobreviventes recebem um pequeno impulso. Congelados quebram. Plantas fixas não são arremessadas; seu bloco de suporte não é destruído. Bosses não fazem parte dessa interação.
Inimigos móveis passaram a usar gravidade e colisões também ao permanecer sobre blocos. Se o suporte é destruído, os sobreviventes caem e encontram o chão; não ficam suspensos. Isso também evita que inimigos congelados fiquem flutuando sem suporte. Transporte e arremesso de congelados não foram adicionados.
Há encontros demonstrativos nas fases 8 (Windmill Heights, lançador de martelos) e 11 (Hammer Ridge, saltador) com inimigos patrulhando uma fileira de tijolos sobre chão seguro.

## Preservação
As 17 etapas, o mapa, poderes, vidas, moedas acumuladas, cogumelo verde, Game Over no mapa, saída pela pausa, progressão salva, desafios de nuvem, lava e arena final continuam presentes. Não foram adicionadas dependências. O portfólio e src não foram modificados.

## Verificação
- 58 grupos de testes do jogo e 13 das mecânicas passaram: 71 no total.
- Testes novos incluem matriz de dano do Sentinela e preservação do gelo no Storm King; pisão e proteção temporária; forma gráfica do item; passagem lateral e por cima de blocos invisíveis; salto real para revelar cada bloco autorado; prêmio único; recusa de revelação com ocupantes sobrepostos; colisão depois da revelação; reset entre tentativas.
- Testes de impacto verificam inimigo apoiado, inimigos ao lado/no ar/abaixo que não devem receber dano, resistência e proteção temporária, congelados, plantas fixas e ausência de impacto em plataformas comuns. Saltos reais foram usados para bater em caixa cheia, caixa gasta e tijolo, com queda do sobrevivente quando o tijolo é quebrado.
- Continuam passando os testes de vida verde alcançável por Small nas 17 etapas, moedas e vidas, mapa, nuvens, bosses e percurso normal da primeira fase.
- Compilação do site concluída. Avisos antigos do React Router e sitemap sem domínio configurado continuam existindo.
- Navegador: conferidos o desenho Hammer/Ice lado a lado, revelação de bloco por Espaço, impacto em patrulha sobre tijolo e disparo de gelo contra o Sentinela com aviso de resistência. Sem erros de console nas páginas inspecionadas.
- Cenas de prévia usaram atalhos locais para chegar aos pontos e invencibilidade em alguns testes de inspeção; essas cenas não são incluídas no pacote. Não houve partida humana completa das 17 fases, teste em celular físico ou medição formal de desempenho. Dano Fire/Hammer, proteção do boss, queda de suporte e casos de colisão foram verificados automaticamente; equilíbrio e legibilidade ainda dependem de jogar.

## Instalação
1. Extraia jarvis-checkpoint-7-completo.zip em uma pasta nova.
2. Na raiz de ThalesXavier-Lab no GitHub, escolha Add file > Upload files.
3. Envie diretamente os quatro itens: public, scripts, CHECKPOINT7.md e JARVIS.md. Não envie o ZIP fechado nem a pasta externa.
4. Clique Commit changes e aguarde a publicação verde da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e pressione Ctrl+F5.
6. Confira CHECKPOINT 7 · BLOCKS & SURPRISES.

O pacote contém a pasta inteira do jogo para evitar mistura de versões. Não é necessário apagar o progresso. Nada foi publicado automaticamente; o envio segue o fluxo manual pelo GitHub já utilizado.

## Testes sugeridos ao jogador
- Comparar a Hammer Flower com a Ice Flower.
- Atacar o Sentinela com Ice (sem dano), Fire e Hammer (com dano), além de pisões.
- Procurar a pista de moeda isolada na primeira fase: saltar revela um bloco gasto e concede uma moeda. Tentar bater novamente não concede outra.
- Nas fases 8 e 11, atingir por baixo os tijolos com patrulhas, primeiro pequeno e depois grande. Conferir dano, impulso e queda se o suporte for quebrado.
- Conferir moedas acumuladas, vida verde, saída pela pausa, Game Over no mapa e travessias de nuvem, especialmente se algum inimigo ficou preso após a mudança de física.
