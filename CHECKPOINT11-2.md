# Atualização 11.2 — Crossroads

## Encruzilhadas
Os atalhos descobertos agora aparecem como caminhos de terra curvos, com placas de madeira A/B nas duas pontas. Ao chegar pela rota normal ou retornar ao mapa numa dessas pontas, abre uma escolha:
- **A ou 1:** seguir o caminho secreto, com o destino identificado.
- **B ou 2:** seguir a continuação normal. Se a próxima fase estiver bloqueada, esta opção entra na fase atual, sem furar a progressão.
- Também é possível escolher com setas e confirmar com Enter/Espaço, clicar ou tocar nos botões.
- Esc ou o X fecha a placa. S, clique na placa ou no caminho permite reabrir a escolha.

Há três conexões, com seis placas:
- Treetop Trail ↔ Cloudstep Cliffs.
- Crystal Cavern ↔ Sunken Gardens.
- Moonlit Marsh ↔ Last Light Ascent.

Os caminhos só aparecem depois de descobrir a saída secreta correspondente. Chegar por um atalho não abre imediatamente outra janela, evitando um ciclo de confirmações. A animação de Jarvis acompanha a curva de terra. As fases puladas não são marcadas como concluídas.

## Preservação
Os atalhos descobertos e os 51 fragmentos continuam salvos. Não apague o progresso. Permanecem os desafios opcionais da versão 11.1, poderes, chefes, vidas, moedas, pausa e respawn. O portfólio não foi alterado.

## Validação
Passaram **146 grupos de testes**: 95 de jogo/integração, 13 de cenário, 13 de gelo, 13 de inimigos e 12 de exploração. Os novos testes cobrem as seis pontas, escolhas A/B, bloqueios de progressão, teclado, clique/toque, chegada automática, fechamento e proteção contra Espaço mantido pressionado. A compilação também terminou com sucesso; permanecem os avisos anteriores do React Router e do sitemap sem domínio configurado.

Na prévia do navegador, A levou Jarvis de Treetop Trail a Cloudstep Cliffs e B seguiu até Crystal Cavern, abrindo a próxima encruzilhada. O diálogo foi inspecionado em desktop e numa prévia de 390 px, sem erros de execução registrados. Não houve teste em celular físico nem uma partida humana completa. As cenas temporárias de teste foram removidas do pacote.

## Testes para você
1. Com o atalho de Treetop Trail descoberto, chegue à placa: a janela deve abrir.
2. Aperte A: Jarvis deve ir a Cloudstep Cliffs pela terra, sem reabrir a janela imediatamente.
3. Aperte S e A para voltar. Confira também os outros dois atalhos, nos dois sentidos.
4. Escolha B para seguir a sequência normal. Se a próxima fase estiver bloqueada, B deve permitir jogar a atual.
5. Teste 1/2, setas + Enter, clique e Esc. Feche a placa e entre na fase com Espaço.
6. Reabra o jogo: atalhos e fragmentos anteriores devem permanecer salvos.

## Instalação
Extraia **jarvis-atualizacao-11-2-completa.zip**. Na raiz do repositório, envie diretamente **public**, **scripts**, **CHECKPOINT11-2.md** e **JARVIS.md**, depois clique em Commit changes. Não envie a pasta externa que contém esses quatro itens.

Após a publicação da Cloudflare, atualize https://thalesxavierwork.com/jarvis/ com Ctrl+F5 e confira **CHECKPOINT 11.2 · CROSSROADS**. Este pacote contém 28 arquivos e ainda não foi publicado.
