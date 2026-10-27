# Checkpoint 9 — Rivals on the Trail

## O que mudou
- Gelo arremessado com X/K continua deslizando após pousar, sem limite de tempo ou distância e sem descongelar durante o lançamento.
- E/J continua soltando normalmente, sem iniciar o deslizamento. A continua sendo mover para a esquerda.
- Novos inimigos: Guardião de Casco, Asa Errante e Broto de Brasa (planta que dispara fogo), com desenhos originais distintos.
- Salto do Storm King corrigido: depois que a batalha começa, recuar não suspende mais o movimento do chefe.

## Gelo deslizante
A velocidade horizontal é mantida; gravidade, colisões por passos de até quatro unidades e plataformas continuam valendo. Ao acabar uma plataforma, o gelo cai. Ele quebra em paredes, tetos, lava, limites da fase e contato com chefes; não causa dano aos chefes.
Um inimigo comum atingido é derrotado, e o gelo continua. Um alvo congelado também quebra. Contra inimigos resistentes, o gelo causa dois pontos de dano: se o alvo sobreviver, o gelo se quebra. Cada alvo recebe no máximo um impacto por lançamento. Proteções temporárias de dano continuam sendo respeitadas.
Pousar no chão, mesmo após uma queda, não encerra o lançamento. Ele não vira um inimigo ativo ao acabar o antigo temporizador. A separação entre movimento horizontal e vertical evita que o contato contínuo com o piso esconda colisões laterais com paredes.
Soltar com E/J mantém o objeto parado horizontalmente e retoma o descongelamento normal. Carregar, soltar, ficar sobre o gelo e quebrar com Baixo+X/K preservam os controles anteriores.
Os objetos lançados pertencem à tentativa atual. Sair, morrer ou reiniciar reconstrói a fase; nenhum objeto é transferido entre fases nem incluído no progresso salvo.

## Guardião de Casco
- Caminha lentamente; o contato lateral causa dano.
- Um pisão o recolhe no casco, sem derrotá-lo.
- Encostar em um casco parado o chuta para longe de Jarvis. Há uma curta proteção no lançamento para evitar dano no mesmo contato.
- O casco desliza, rebate em paredes e derrota inimigos. Um novo pisão o para novamente.
- Um casco em movimento pode causar dano a Jarvis depois da proteção inicial.
- Fire e Hammer podem derrotá-lo; Ice permite congelar e usar o transporte existente.
- Pancadas em blocos sob ele o recolhem; lava e quedas fora da fase o removem.
- O casco não recebe transporte separado: E/J continua reservado ao objeto congelado.

## Broto de Brasa
É uma variante enraizada da planta, com cor avermelhada e uma pequena chama na cabeça. Mantém os ciclos de abertura e fechamento, avisa antes de atirar e só acumula o disparo com Jarvis em alcance. Não dispara colado ao personagem. As bolas de fogo obedecem ao limite global e somem ao bater no cenário ou expirar.
Não aceita pisão enquanto ativo, mas pode ser derrotado com os poderes apropriados. Congela e quebra como a planta comum, sem poder ser carregado ou virar apoio transportável. Seus pontos de inserção ficam afastados dos checkpoints.

## Asa Errante
Patrulha uma região horizontal com oscilação vertical suave, asas claras e corpo roxo. Pode receber pisão, Fire, Hammer e Ice. Ao congelar, cai por gravidade e pode servir de apoio ou ser carregado. Se descongelar com segurança, retoma o voo a partir da nova posição; não salta de volta para o ponto antigo. Paredes e tetos limitam o movimento.

## Chefe final
A causa encontrada foi a condição que interrompia a atualização quando Jarvis ficava antes de x=7340. Essa condição também era aplicada depois de o salto começar, congelando a posição enquanto o jogador recuava.
Agora o limite só inicia a batalha. Uma vez iniciada, a máquina de estados continua funcionando até o fim da tentativa. A duração do salto é definida na decolagem, impedindo que uma mudança de fase por dano altere abruptamente a trajetória em andamento.
Continuam os três pontos de pouso, avisos, recuperação, vida e aumento de intensidade. A pausa intencional continua congelando a simulação. Reiniciar a fase reconstrói o chefe e sua ativação.

## Progressão e distribuição
A primeira fase mantém apenas inimigos terrestres básicos. O casco aparece a partir de Treetop Trail. Os voadores surgem em Crystal Cavern e os brotos de fogo nas fases posteriores. Novos encontros ocupam espaços livres e não foram colocados nas travessias obrigatórias de nuvem nem na arena do chefe. Nem toda fase recebe todos os tipos: fases sem espaço seguro preservam os encontros anteriores. Não foram adicionados power-ups para compensar os novos inimigos.

| Fase | Novos encontros nesta versão |
|---|---|
| Dewdrop Meadow | Arquétipos anteriores preservados |
| Treetop Trail | Casco (x≈1840) |
| Amber Aqueduct | Casco (x≈1325) |
| Bramble Crossing | Arquétipos anteriores preservados |
| Cloudstep Cliffs | Casco (x≈700) |
| Crystal Cavern | Casco (x≈1985), Voador (x≈2370) |
| Frostfall Run | Casco (x≈900), Voador (x≈3760) |
| Windmill Heights | Arquétipos anteriores preservados |
| Sentinel Tower | Casco (x≈1400), Planta de fogo (x≈4110) |
| Sunken Gardens | Casco (x≈2040), Voador (x≈2590), Planta de fogo (x≈2205) |
| Emberworks | Casco (x≈980), Voador (x≈4040), Planta de fogo (x≈2270) |
| Hammer Ridge | Casco (x≈1845), Voador (x≈4800), Planta de fogo (x≈4580) |
| Moonlit Marsh | Casco (x≈5130), Planta de fogo (x≈5580) |
| Skyrail Summit | Casco (x≈2950), Planta de fogo (x≈6120) |
| Thunder Pass | Casco (x≈2720), Planta de fogo (x≈6220) |
| Last Light Ascent | Casco (x≈2320), Planta de fogo (x≈2485) |
| Storm King Castle | Planta de fogo (x≈4640) |

As posições x são referências internas opcionais, medidas desde o início da fase; não são coordenadas para inserir no navegador.

## Checklist do jogador
1. **Treetop Trail:** encontre o casco, pise para recolher, encoste de lado para chutar, observe o retorno na parede e pise novamente para parar. Confira também o dano lateral.
2. **Crystal Cavern:** observe o voo; teste pisão e congelamento. Depois de congelar, tente carregar, soltar e arremessar.
3. **Emberworks:** reúne casco, voador, planta comum, broto de fogo e Ice Flower. Observe os avisos, desvie dos disparos e teste os três poderes ofensivos em tentativas diferentes.
4. **Amber Aqueduct ou Emberworks:** pequeno recebe cogumelo da caixa de poder; grande recebe Ice Flower. Congele um inimigo, E/J para pegar e X/K para lançar. Confira que ele continua deslizando após pousar, derrota alvos sucessivos e quebra em parede ou buraco. E/J deve apenas soltar.
5. **Storm King Castle:** entre na luta, espere o primeiro salto e recue para a esquerda. O chefe deve terminar o salto normalmente. Repita após causar dano, pause no ar e retome; confira também morte e reinício.
6. Confira rapidamente moedas, vidas, poder salvo, checkpoints e saída para o mapa.

## Validação realizada
- 63 grupos do jogo e integração, 13 de mecânicas de cenário, 13 de gelo e 13 específicos desta versão: **102 grupos passaram**.
- Cobertura nova: deslizamento acima do antigo limite, múltiplos alvos, inimigos resistentes, parede fina, queda e lava; cascos, chutes nas duas direções, ricochete, contato real com Jarvis e recolhimento; planta de fogo com aviso e congelamento; voo, queda congelada e retomada; progressão e distância dos checkpoints; matriz de ataques dos oito arquétipos; primeiro salto do chefe com recuo nas três intensidades, estabilidade durante dano, pausa e reinício.
- Permanecem passando os testes anteriores de poderes, oito travessias de nuvem, vida extra, blocos, mapa e salvamento, incluindo conclusão da primeira fase com comandos normais.
- Compilação do portfólio validada. Avisos já existentes do React Router e sitemap sem domínio configurado permanecem.
- No navegador, em cenas locais de teste, E pegou e X lançou gelo; o objeto derrotou dois inimigos sucessivos e se quebrou na parede. O chefe aterrissou e continuou a luta após Jarvis recuar para x=7200. A aparência dos novos inimigos foi inspecionada em uma cena de prévia.
- As cenas de teste utilizavam acesso direto a situações e invulnerabilidade; não estão no pacote. Não foi realizada uma partida humana completa das 17 fases, teste em celular físico ou medição formal de desempenho. A dificuldade e a sensação dos novos encontros precisam da avaliação do jogador.

## Instalação pelo GitHub
1. Extraia **jarvis-checkpoint-9-completo.zip** em uma pasta nova.
2. No repositório ThalesXavier-Lab, abra Add file > Upload files na raiz.
3. Envie diretamente **public**, **scripts**, **CHECKPOINT9.md** e **JARVIS.md**. Não envie o ZIP fechado nem a pasta que envolve esses itens.
4. Clique Commit changes e aguarde a publicação da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e atualize com Ctrl+F5.
6. Confira o título **CHECKPOINT 9 · RIVALS ON THE TRAIL**.

O pacote inclui toda a pasta public/jarvis e os quatro scripts de testes. O portfólio em src, as dependências e a configuração de hospedagem não foram alterados. O progresso anterior continua compatível; não é necessário apagá-lo. Esta entrega ainda não foi publicada.
