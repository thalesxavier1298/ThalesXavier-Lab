# Checkpoint 11 — Hidden Trails

## Resumo
Green Valley continua com 15 fases regulares, torre e castelo. A atualização adiciona três fragmentos especiais por etapa (51 no total), desvios elevados e ruínas exploráveis, três áreas bônus, três saídas secretas com atalhos e confirmação com Espaço nas telas de morte e Game Over.

## Confirmação por teclado
- Na tela de morte, Espaço executa Retry e reaparece no checkpoint com as regras anteriores de forma, vida e tempo.
- No Game Over, Espaço executa o retorno ao mapa com cinco vidas, preservando moedas e conclusões.
- Botões clicáveis continuam disponíveis, com instrução visível de confirmação por Espaço.
- Segurar Espaço ao morrer ou pressioná-lo durante a animação não confirma automaticamente a tela seguinte. É necessário soltar e pressionar novamente. Repetições automáticas são ignoradas.
- A confirmação não entra em outra fase nem gera um salto no reaparecimento. A tecla precisa ser solta antes de voltar a servir como salto ou entrada pelo mapa.

## Fragmentos de estrela
Os colecionáveis são losangos dourados com centro roxo, distintos das moedas comuns. Cada etapa tem identidades estáveis de 0 a 2, totalizando 51. Nas fases com sala bônus, o terceiro fragmento fica dentro da sala; os outros dois ficam na fase principal.
O HUD mostra três espaços preenchidos conforme as descobertas. O mapa mostra o número encontrado em cada etapa. A descoberta é salva imediatamente: permanece após morte, Game Over, saída e recarga da página. O fragmento encontrado fica translúcido nas próximas visitas, sem incrementar novamente o registro.
Fragmentos não alteram moedas ou vidas e não são obrigatórios para terminar o jogo. Os poderes continuam disponíveis normalmente; os novos desafios não exigem uma forma específica para recolher os fragmentos.

## Desvios e passagens
Os fragmentos ocupam bolsões determinísticos de exploração: plataformas opcionais acima do caminho, desvios em alturas diferentes e passagens por trás de arcos em ruínas. A seleção evita obstáculos sobrepostos, perigos, pontos de retorno e travessias obrigatórias de nuvem. Onde não existe espaço para uma plataforma elevada, usa-se uma passagem baixa em um apoio existente.
A rota principal permanece livre e as fases mantêm sua identidade. O jogador pode voltar ao caminho após explorar os desvios. Cada fase recebeu 60 segundos adicionais para exploração, sem alterar o tempo restante durante transições de sala.

## Áreas bônus
Entre com **Seta para cima ou W**, próximo ao arco dourado BONUS. No toque, use **EXPLORE ↑**. No arco azul RETURN, use a mesma ação para retornar. É preciso soltar cascos ou gelo antes de usar os arcos.

- **Dewdrop Meadow (fase 1): Starlight Grotto.** Sequência opcional de saltos entre plataformas, moedas e fragmento na parte alta.
- **Crystal Cavern (fase 6): Crystal Archive.** Arquivo sob uma passagem baixa; Jarvis grande precisa usar Baixo + movimento para rastejar. Há um caminho superior alternativo.
- **Emberworks (fase 10): Ember Loft.** Plataforma temporária sinalizada e um fragmento na parte alta, com piso seguro abaixo para tentar novamente.

Ao entrar, a fase principal fica preservada em memória: caixas usadas, inimigos, itens, projéteis, plataformas e checkpoint não são reconstruídos. O tempo restante continua correndo na sala e não é restaurado ao sair. Moedas, vidas e forma são compartilhadas.
A mesma sala é reutilizada durante a tentativa, mantendo moedas já recolhidas e plataformas alteradas. Sair e entrar não cria novas recompensas. Morrer restaura a fase principal e usa seu checkpoint; a tentativa seguinte segue a regra anterior de reconstrução da fase. Sair para o mapa também encerra a visita corretamente.
A pausa suspende o tempo. O cenário principal fica suspenso durante a visita à sala bônus. Objetos carregados não atravessam os arcos.

## Saídas secretas e mapa
Saídas roxas SECRET são diferentes da chegada normal e também usam Cima/W ou EXPLORE. Elas registram a descoberta, salvam o poder atual e mostram uma tela de confirmação. Não marcam a fase de origem como concluída normalmente.

- **Treetop Trail → Cloudstep Cliffs.**
- **Crystal Cavern → Sunken Gardens.**
- **Moonlit Marsh → Last Light Ascent.**

O mapa revela uma conexão roxa pontilhada. Para percorrê-la, use o botão **Secret path**, ou **Shift + Seta direita** na origem. Na outra ponta, **Shift + Seta esquerda** retorna. As setas simples continuam percorrendo o caminho principal. Clique em uma fase acessível continua funcionando.
Concluir uma fase alcançada por atalho registra apenas essa conclusão e abre a seguinte. As fases puladas não recebem marca de conclusão. Quando o percurso principal alcançar uma fase já concluída por atalho, a progressão é conciliada automaticamente.
A campanha principal não exige nenhum segredo. O nome, a quantidade de fases e os chefes foram preservados.

## Onde procurar
As posições abaixo são referências internas aproximadas, medidas desde o início da fase. Não são comandos para inserir no navegador.

| Fase | Tipo de arco | Posição | Destino |
|---|---|---|---|
| Dewdrop Meadow | bonus | x≈2793 | Sala bônus com retorno à mesma fase |
| Treetop Trail | secret | x≈3193 | Cloudstep Cliffs |
| Crystal Cavern | bonus | x≈3858 | Sala bônus com retorno à mesma fase |
| Crystal Cavern | secret | x≈3878 | Sunken Gardens |
| Emberworks | bonus | x≈4313 | Sala bônus com retorno à mesma fase |
| Moonlit Marsh | secret | x≈4423 | Last Light Ascent |

Procure as placas de pista e os arcos acima ou ao lado da rota. No caso de Crystal Cavern, o arco bônus fica em uma plataforma elevada da região de cristais.

## Salvamento
Os novos dados ficam na chave jarvis-hidden-trails-v1, separados do progresso linear e do registro de moedas, vidas e forma existentes. Registros antigos continuam válidos, com os fragmentos e segredos inicialmente vazios.
Dados ausentes ou inválidos são filtrados; falhas no armazenamento não interrompem a partida, embora não seja possível garantir persistência quando o navegador impede gravar.
Reset progress agora informa que apaga fases, moedas, vidas, fragmentos e caminhos secretos, e limpa todos esses registros.

## Verificação realizada
- **132 grupos passaram:** 81 do jogo e integração, 13 de cenário, 13 de gelo, 13 de inimigos e 12 de exploração.
- Foram verificados os 51 IDs sem duplicação, três fragmentos por etapa contando as salas bônus, ausência de sobreposição com terreno/perigos e acesso aos fragmentos das fases principais com o integrador real do Jarvis pequeno, a partir de seu apoio.
- As rotas de saltos das salas elevadas e a travessia do arquivo baixo foram verificadas com controles normais. Retornos têm apoio e espaço para as formas grandes.
- Foram testados coleta imediata e persistência, compatibilidade com progresso linear antigo, dados corrompidos, armazenamento bloqueado, coleta única, atalhos sem completar fases puladas e limpeza ao apagar progresso.
- A integração cobre Espaço em morte e Game Over, tecla mantida durante a morte, repetição, ausência de salto automático, confirmação única, estado preservado nas salas, moedas sem duplicação por reentrada, pausa, morte/saída nas salas e recusa de transporte pelos arcos.
- Permanecem os testes anteriores de poderes, primeira fase com comandos normais, checkpoints, blocos, inimigos, chefes, mapa, transporte e oito travessias obrigatórias de nuvem.
- A compilação do portfólio passou. Permanecem avisos anteriores do React Router sobre use client e sitemap adiado pela ausência de domínio na configuração.
- No navegador, em cenas locais de teste, foram conferidos: entrada e retorno com Cima, coleta e HUD, persistência do fragmento no mapa, respawn e Game Over com Espaço, descoberta da saída secreta e navegação pelo botão de atalho. Nenhum erro de execução foi registrado nessa inspeção.
- O mapa, seus contadores e conexões foram inspecionados em desktop e a interface também foi conferida em janela incorporada de 390 pixels.
- As cenas locais usavam atalhos para acessar as situações e invulnerabilidade; foram retiradas da pasta pública e não estão no ZIP. Não houve uma partida humana completa das 17 fases, teste em celular físico nem medição formal de desempenho. O ritmo de exploração e a clareza de todas as pistas ainda precisam da avaliação do jogador.

## Checklist do jogador
1. Morra segurando Espaço: a tela deve esperar soltar e pressionar novamente. Ao confirmar, Jarvis não deve saltar sozinho.
2. Esgote as vidas e confirme Game Over com Espaço: deve voltar ao mapa com cinco vidas e suas moedas.
3. Em Dewdrop Meadow, encontre o arco BONUS, entre, recolha moedas e o fragmento, volte e entre de novo. Recompensas já encontradas não devem reaparecer como novas.
4. Feche e reabra a página: o mapa deve manter o fragmento encontrado. Recolhê-lo novamente não aumenta o contador.
5. Em Crystal Cavern, explore o arquivo baixo. Em Emberworks, teste a plataforma temporária da sala bônus.
6. Em Treetop Trail, procure a saída SECRET. Confira o caminho roxo até Cloudstep Cliffs e que Amber Aqueduct/Bramble Crossing não recebem marcas de conclusão por terem sido puladas.
7. Confira que as fases principais, o poder salvo, as moedas, vidas, checkpoints e chefes continuam funcionando.

## Instalação pelo GitHub
1. Extraia **jarvis-checkpoint-11-completo.zip** em uma pasta nova.
2. Na raiz de ThalesXavier-Lab, abra **Add file > Upload files**.
3. Envie diretamente **public**, **scripts**, **CHECKPOINT11.md** e **JARVIS.md**. Não envie o ZIP fechado nem a pasta externa.
4. Clique **Commit changes** e aguarde a publicação da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e pressione Ctrl+F5.
6. Confira **CHECKPOINT 11 · HIDDEN TRAILS**.

O pacote contém toda a pasta public/jarvis e cinco scripts de testes: 27 arquivos no total. O portfólio em src, dependências e hospedagem foram preservados. A entrega ainda não foi publicada no domínio.
