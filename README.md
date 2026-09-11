# My Pokédex Tracker

Uma Pokédex pessoal local para acompanhar National Dex, Regional Dex, Living Dex, Form Dex, Shiny Dex e Pokémon HOME.

## Como abrir

A forma mais simples é usar um servidor local, porque alguns navegadores bloqueiam `fetch` ao abrir HTML direto por `file://`.

### Python

```bash
cd pokedex-local
python -m http.server 8080
```

Abra `http://localhost:8080`.

### Node

```bash
npx serve .
```

## O que já tem

- National Dex puxada da PokéAPI
- Filtro por gerações I–IX
- Dex regionais (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar e Paldea + DLCs disponíveis)
- Marcação de Visto, Capturado, Shiny e Pokémon HOME
- Living Dex / Shiny Dex / HOME com contadores independentes
- Form Dex: abre o Pokémon e carrega variações/formas disponíveis na API
- Dashboard de progresso por geração
- Busca por nome ou número
- Filtro de faltantes/vistos/capturados
- Tema claro/escuro
- Backup e restauração por arquivo JSON
- Progresso salvo em `localStorage`, sem login e sem servidor

## Observações

- Dados e imagens precisam de internet para serem carregados da PokéAPI/PokeAPI sprites. O progresso em si fica somente no navegador.
- A cobertura de formas e dex regionais depende do que a PokéAPI expõe.
- Para levar seu progresso para outro navegador/computador, use Exportar backup / Importar backup.


## V2 — Pokédex por jogo
Nova seção **Por jogo**, com progresso independente por título/série, de Red/Green/Blue e Yellow até Scarlet/Violet, DLC e Pokémon Legends: Z-A. O progresso continua salvo localmente.


## V3 — marcação rápida e conquistas
- Na aba **Por jogo**, cada Pokémon ganhou um botão grande de check **Marcar como pego / ✓ Peguei!**.
- Ao completar 100% de uma Pokédex de jogo, aparece uma comemoração com troféu.
- Pokémon obtidos podem gerar um post para o X.
- Ao completar um jogo, a tela de conquista também gera um post para o X e permite copiar o texto.

## V4 — navegação por geração → jogo → Pokémon
A navegação principal agora é hierárquica. Abra uma geração na lateral, escolha um jogo ou veja os Pokémon introduzidos naquela geração. Ao abrir um Pokémon, todas as coleções dele ficam centralizadas em abas: Living Dex, Form Dex, Shiny Dex, Jogos/Regional e Pokémon HOME. O save continua usando a mesma chave local das versões anteriores.


## Marcar jogo inteiro
Na página de cada jogo há um botão **✓ Marcar todos como pegos**. Ele marca de uma vez todos os Pokémon ainda faltantes daquele jogo e dispara a comemoração quando a Pokédex chega a 100%.


## PWA / Web App instalável
Esta versão inclui `manifest.webmanifest`, service worker e ícones. Abra por **HTTPS** ou em `localhost` e use o botão **Instalar app** quando o navegador disponibilizar. O progresso continua no `localStorage`; use Exportar backup regularmente para ter uma cópia fora do navegador.

O service worker mantém o app shell em cache e guarda respostas/sprites já visitados. A primeira carga da lista completa ainda precisa de internet; depois, conteúdo já cacheado pode abrir offline.

## Backup
O export gera um JSON versionado com Pokémon, formas, progresso por jogo e jogos concluídos. O import valida a estrutura, mostra um resumo e pede confirmação antes de substituir o save atual. Backups antigos continuam aceitos.


## V5.1 — navegação por jogo
- O menu por geração agora lista apenas os jogos; removido “Todos os Pokémon da geração”.
- O Dashboard mostra progresso separado por jogo dentro de cada geração, incluindo 100% e troféu.
- O progresso usa a Pokédex regional do jogo quando disponível na PokéAPI.
- Corrigido o botão de instalação para não cortar o texto.


## V5.2 — Sincronização com National Dex
Ao marcar um Pokémon como pego em qualquer jogo, ele também é marcado automaticamente como capturado/visto na National Dex e na Living Dex global. Desmarcar em um jogo não remove da National Dex, já que o Pokémon pode ter sido obtido em outro jogo. O botão de marcar todos de um jogo também sincroniza tudo com a National Dex.


## V6
- Contadores derivados do estado atual: desmarcar reduz a Living Dex quando não há outra origem.
- Sincronização por origem: captura em jogo conta na National Dex; ao desmarcar, permanece apenas se estiver em outro jogo ou marcada manualmente.
- Modo Boxes estilo HOME.
- Conquistas e timeline local.
- Página do Pokémon com tipos, altura, peso e linha evolutiva quando disponíveis.
- Card PNG para compartilhar conclusão de jogo.
- Backup atualizado para incluir timeline.


## V6.1 — controles de limpeza
- **Desmarcar todos** em uma Pokédex de jogo, com confirmação e recálculo da National Dex.
- **Zerar save completo**, com confirmação dupla. O reset apaga somente o progresso; tema e instalação PWA permanecem.
- O backup agora é exportado como versão 6.1.


## V6.2 — Encontrados sincronizados
O contador **Encontrados** agora acompanha a National/Living Dex: pegar um Pokémon em qualquer jogo marca também como encontrado; ao desmarcar sua última origem, ele deixa de contar como encontrado. Saves antigos são recalculados automaticamente ao abrir.


## V7 — Onde obter
A ficha do Pokémon ganhou a aba **📍 Onde obter**, com encontros por versão, localização, método, nível, chance e condições quando a PokéAPI informa. Eventos históricos, presentes especiais e transferências ainda não são uma base completa; nesses casos o app sinaliza a limitação em vez de inventar uma origem.
