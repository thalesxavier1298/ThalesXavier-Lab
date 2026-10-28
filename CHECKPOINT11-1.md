# Atualização 11.1 — Secret Challenges

## Atalhos acessíveis
O caminho roxo anteriormente exigia Shift + setas e o botão só aparecia nas duas pontas da conexão. Agora:
- Pressione **S no mapa**. Na ponta de um atalho, Jarvis o percorre; em outro lugar, aparece a lista dos caminhos descobertos.
- Use o botão **Discovered shortcuts (S)** ou **Use secret path (S)**.
- Clique no próprio caminho roxo. Ele também tem foco de teclado e aceita Enter.
- Na lista, escolha uma conexão. Jarvis é levado à entrada e percorre a curva até o destino. Depois, Espaço entra na fase selecionada.
- Os botões da lista funcionam com mouse e toque. As setas simples continuam navegando na rota principal; o comando antigo com Shift também continua disponível.

Atalhos descobertos antes da atualização permanecem disponíveis. A navegação não marca fases puladas como concluídas nem altera moedas, vidas ou fragmentos.

## Desafios antes das recompensas
Os arcos continuam visíveis como pistas. Cima/W ou EXPLORE entra agora em um percurso opcional de acesso, antes da sala bônus ou da saída secreta. Ao concluir o mecanismo, a barreira abre; alcance o arco do outro lado e use Cima/EXPLORE para receber acesso à recompensa.
A rota normal da fase não foi redesenhada. Os dois primeiros fragmentos e os chefes permanecem como antes. O terceiro fragmento das fases com bônus fica atrás do novo desafio e da própria sala bônus.

| Fase | Acesso | Desafio com o poder efetivo da fase |
|---|---|---|
| Dewdrop Meadow — fase 1 | Bônus | Fire Flower: acender três braseiros com bolas de fogo, atravessando plataformas. |
| Treetop Trail — fase 2 | Saída secreta | Helicóptero: alcançar duas plataformas altas com impulsos, pousando para recuperar o impulso, e flutuar até a saída. |
| Cloudstep Cliffs — fase 5 | Novo bônus | Nuvem: atravessar um vão de 560 unidades com saltos corridos e duas nuvens. |
| Crystal Cavern — fase 6 | Bônus | Hammer Flower: subir às plataformas e acertar três alvos elevados com a trajetória em arco do martelo. |
| Crystal Cavern — fase 6 | Saída secreta | Martelo: variante com um quarto alvo antes da saída. |
| Emberworks — fase 10 | Bônus | Ice Flower: congelar dois inimigos diferentes, carregar e soltar um em cada receptor. O segundo receptor fica elevado. |
| Moonlit Marsh — fase 12 | Saída secreta | Helicóptero: sequência de subida por plataformas altas e travessia aérea. |

O novo bônus de Cloudstep Cliffs recebe o fragmento 4:2, que antes ficava na fase principal. Sua identidade é a mesma: se já foi encontrado, continua encontrado. Permanecem 51 fragmentos, sem duplicação.

## Regras dos desafios
- Duas caixas de suprimento ficam separadas por 240 unidades. Pequeno recebe cogumelo; grande recebe o poder da fase. Nenhum item aparece automaticamente.
- O uso do poder é necessário para abrir a barreira. Só chegar ao arco final com outro poder não resolve o mecanismo.
- O desafio de gelo exige soltar o objeto: passar sobre o receptor carregando não basta. O receptor absorve o objeto e mantém sua carga, evitando reutilizar o mesmo inimigo nas duas posições.
- **C** ou **Retry secret trial** reinicia apenas o desafio, sem perder vida nem restaurar o tempo. Jarvis volta pequeno e as caixas locais ficam disponíveis novamente.
- Uma queda fora da tela nesse percurso também reinicia o desafio sem descontar vida. Inimigos ainda podem causar dano normalmente, e o tempo continua valendo.
- O arco azul retorna à fase principal. Solte objetos carregados antes de atravessar arcos.
- Sair e reentrar preserva o estado do desafio durante a mesma tentativa. Só o comando de reinício ou uma queda reconstrói o percurso.
- Os percursos não têm moedas comuns nem fragmentos próprios: reiniciá-los não produz moedas ou vidas infinitas.
- Após vencer um desafio, seu acesso fica aberto durante a tentativa atual. Morte/reinício da fase cria uma nova tentativa. Fragmentos e saídas já descobertos continuam salvos.
- O relógio não é restaurado nas transições. Pause se precisar interromper a partida.

## Referências de design
A abordagem usa desafios de poder combinados com mecanismos e pistas, em vez de acessos que dependam apenas de encontrar a porta.
- [Dicas oficiais de Super Mario Maker 2 — Nintendo](https://play.nintendo.com/news-tips/tips-tricks/super-mario-maker-2-tips-tricks/): referência para combinar peças e mecanismos em pequenos desafios.
- [Análise comunitária de saídas secretas na série Mario](https://www.reddit.com/r/MarioMaker/comments/c5z970/dev_exits_arent_all_bad_a_look_at_how_nintendo/): referência para rotas opcionais que exigem usar um poder ou alcançar uma área elevada, com pistas.

São referências de princípios. Os percursos e recursos visuais do Jarvis continuam próprios. Não foram copiados mapas nem recursos gráficos de Mario. O ajuste busca dificuldade moderada; não introduz saltos de precisão extrema, blocos surpresa letais ou exigência de sacrificar uma vida para descobrir o caminho.

## Validação
- **140 grupos passaram:** 89 do jogo/integração, 13 de cenário, 13 de gelo, 13 de inimigos e 12 de exploração.
- Testes novos verificam S e lista global, percorrer conexões nas duas direções, atalhos clicáveis, bloqueio do arco antes de resolver o desafio, preservação na reentrada e reinício sem restaurar tempo/vidas.
- Soluções verificadas com a simulação real: nuvens com corrida e saltos, subida com dois impulsos do helicóptero, acerto dos braseiros com projéteis reais de fogo e dos alvos elevados com martelos. O transporte e a entrega de dois objetos congelados foram verificados por integração, incluindo recusa de carregar por cima do receptor sem soltar.
- As verificações anteriores dos 51 fragmentos, salvamento antigo, fases principais, mapas, pausa, respawn, Game Over, chefes e desafios obrigatórios de nuvem continuam passando.
- Compilação do portfólio concluída. Permanecem avisos anteriores do React Router e sitemap sem domínio configurado.
- No navegador, a partir do castelo, S abriu a lista de conexões; escolher Treetop Trail ↔ Cloudstep Cliffs levou Jarvis ao destino correto. O início do desafio de fogo e os controles foram inspecionados visualmente, sem erros de execução registrados.
- As cenas locais de acesso rápido foram removidas da pasta pública e não estão no pacote. Não houve uma partida humana completa de todos os percursos nem teste em celular físico. A sensação da dificuldade ainda precisa da sua avaliação jogando.

## Checklist recomendado
1. No mapa, em qualquer fase distante, pressione S e escolha um atalho que já descobriu. Confirme o destino selecionado e entre com Espaço.
2. Clique em uma linha roxa e teste voltar pela mesma conexão. As fases puladas não devem receber marca de conclusão.
3. Em Dewdrop Meadow, entre no BONUS, pegue os suprimentos e acenda os três braseiros. Antes disso, o arco final deve permanecer inacessível.
4. Em Treetop Trail, tente a subida de helicóptero. Pouse na primeira plataforma antes do próximo impulso.
5. Em Cloudstep Cliffs, teste a travessia de nuvem e uma queda. A queda deve reiniciar sem consumir vida; o relógio não deve aumentar.
6. Em Crystal Cavern, teste os alvos de martelo. Na saída secreta, há um alvo a mais.
7. Em Emberworks, coloque dois inimigos congelados diferentes nos receptores. Confira que carregar sem soltar não ativa o receptor.
8. Saia pelo arco azul, retorne, use C, pause e confira o tempo. Seus fragmentos e saídas antigas devem continuar salvos.

## Instalação pelo GitHub
1. Extraia **jarvis-atualizacao-11-1-completa.zip** em uma pasta nova.
2. Na raiz de ThalesXavier-Lab, use Add file > Upload files.
3. Envie os quatro itens diretamente: **public**, **scripts**, **CHECKPOINT11-1.md** e **JARVIS.md**.
4. Clique Commit changes e aguarde a publicação da Cloudflare.
5. Abra https://thalesxavierwork.com/jarvis/ e atualize com Ctrl+F5.
6. Confira **CHECKPOINT 11.1 · SECRET CHALLENGES**.

O pacote tem 28 arquivos: toda a pasta do jogo, cinco scripts de testes e dois documentos. Não é necessário apagar progresso nem redescobrir atalhos. O portfólio, dependências e hospedagem foram preservados. Esta entrega ainda não foi publicada.
