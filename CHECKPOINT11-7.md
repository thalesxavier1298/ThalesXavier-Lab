# Atualização 11.7 — Teófilo: Reino do Céu

## Novo nome, mesmo progresso
O personagem agora se chama **Teófilo**. O título do jogo, HUD, instruções e cartão da página de projetos usam o novo nome. O endereço /jarvis/ e as chaves internas antigas de salvamento foram preservados para manter links, vidas, moedas, fases e os 51 shards já salvos. Nomes técnicos de arquivos não representam o nome visível do jogo.

## Final cinematográfico
1. Ao derrotar o boss final, a fase é concluída imediatamente e salva. Não é necessário alcançar a bandeira depois do último golpe. A torre mantém o fluxo anterior.
2. A tela **Fase concluída!** oferece **Seguir para o céu**, por clique ou Espaço.
3. Uma cena de mapa mostra um caminho saindo do castelo até um pé de feijão. Teófilo caminha até ele, sobe e desaparece acima da tela.
4. A transição carrega o reino do céu: palácio entre nuvens, trono dourado, baús, moedas e diamantes. Teófilo se aproxima do trono.
5. Aparece **Você conquistou o céu!**, com a mensagem: Parabéns, Teófilo! Você matou o boss final e conquistou o céu.
6. **Ver meus shards** abre uma segunda mensagem. Com menos de 51: Você tem alguns shards para coletar ainda. Volte nas fases e colete tudo, seguido da contagem atual. Com 51/51: Parabéns, você coletou todos os coletáveis do jogo. Agora você zerou 100% dele!
7. **Voltar ao mapa** permite rejogar e explorar as fases restantes, sem abrir automaticamente a encruzilhada.

A animação dura aproximadamente 12 segundos quando a aba está ativa. As confirmações aceitam clique ou um novo toque de Espaço; manter a tecla apertada não pula as duas mensagens. A cena final não desconta vidas, não produz moedas/shards e não consome o tempo da fase. A contagem usa os 51 IDs válidos e únicos, evitando contar duplicatas como progresso.

As fases puladas não são marcadas como concluídas pelo final. A mensagem de coleta completa depende dos 51 shards, conforme solicitado. Quem já derrotou o chefe antes desta atualização pode rejogar o castelo para ver o novo final. Depois de buscar shards pendentes, derrote o chefe novamente para rever a cerimônia com a contagem atualizada.

## Conteúdo anterior incluído
O pacote inclui 11.3 a 11.6: bônus/secret separados, placas com todos os caminhos e Ficar e jogar, volta às fases puladas, menos texto durante as fases, retorno ao mapa sem placa automática e botão de tela cheia. Não é necessário enviar pacotes antigos nem apagar o progresso.

## Validação
**154 grupos passaram:** 102 de jogo/integração e 13 em cada suíte de cenário, gelo, inimigos e exploração. A compilação do site terminou com sucesso, mantendo os avisos anteriores do React Router e sitemap sem domínio configurado.

Os novos testes verificam derrota final sem bandeira, salvamento antes da cena, avanço pelas cenas de caminho/subida/transição/reino, preservação de moedas/vidas/relógio, contagem de 50 e 51 shards, recusa de duplicatas e IDs inválidos, renderização de todas as cenas e confirmação sem pular mensagens por tecla mantida.

No navegador, os dois fluxos foram conferidos com dados de teste locais: 0/51 mostrou coleta pendente; 51/51 mostrou 100% concluído. A animação e o reino foram inspecionados visualmente, sem erros de execução registrados. Os botões temporários de acesso rápido foram removidos da pasta pública e não estão no pacote. Não houve partida humana completa nem teste em celular físico.

## Checklist para você
1. Confira o título **Teófilo: Reino do Céu** e **CHECKPOINT 11.7 · KINGDOM OF THE SKY** após publicar e usar Ctrl+F5.
2. Veja se o progresso antigo permanece: fases, shards, vidas e moedas.
3. Derrote o boss do castelo. Deve aparecer Fase concluída antes da sequência, sem exigir chegar à bandeira.
4. Confirme e acompanhe o caminho, a subida até sair da tela e a chegada ao palácio. O personagem não deve piscar por invencibilidade nessa cena.
5. Confira primeiro a mensagem de conquista e depois a mensagem correspondente à sua quantidade de shards.
6. Teste clique e Espaço nas confirmações, retorno ao mapa e tela cheia durante a sequência. O mapa deve permitir continuar explorando.
7. Para conferir 100% naturalmente, colete os 51 shards e vença o boss novamente. Não precisa apagar o progresso.

## Instalação — atenção à pasta src
Extraia **teofilo-atualizacao-11-7-completa.zip** e envie diretamente à raiz do GitHub estes **cinco itens**:
- **public**
- **scripts**
- **src** (contém apenas pages/pages.jsx, para atualizar o nome no cartão do portfólio)
- **CHECKPOINT11-7.md**
- **JARVIS.md** (documento de compatibilidade atualizado para Teófilo)

Clique Commit changes. Após a Cloudflare publicar, abra https://thalesxavierwork.com/jarvis/ com Ctrl+F5. O pacote contém 30 arquivos verificados; inclui todo o jogo e apenas o arquivo necessário do portfólio. Esta entrega ainda não foi publicada no domínio.
