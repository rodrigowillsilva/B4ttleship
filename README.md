# B4ttleship

Repositório do projeto final de Engenharia de Software e Sistemas Distribuídos.

## Visão Geral

B4ttleship é uma implementação online do clássico jogo de Batalha Naval, desenvolvida para proporcionar uma experiência multiplayer em tempo real. Utilizando tecnologias web modernas e comunicação baseada em MQTT, o jogo permite que jogadores se conectem, entrem em salas de jogo e enfrentem-se em partidas dinâmicas diretamente no navegador.

## Funcionalidades

- **Multiplayer em Tempo Real:** Permite que vários jogadores se conectem e joguem simultaneamente.
- **Salas de Jogo:** Jogadores podem criar ou entrar em salas específicas para partidas privadas.
- **Interface Intuitiva:** Desenvolvida com HTML, CSS e JavaScript para uma experiência de usuário amigável.
- **Comunicação MQTT:** Utiliza o protocolo MQTT para gerenciar mensagens e eventos do jogo de forma eficiente.
- **Lista de Jogadores Dinâmica:** Atualiza automaticamente a lista de jogadores na sala conforme novos participantes entram ou saem.

## Tecnologia e Arquitetura

### Frontend

- **HTML/CSS:** Estrutura e estilização da interface do usuário.
- **JavaScript (ES6 Modules):** Lógica do jogo e interação com o servidor MQTT.
- **Visual Studio Code:** IDE utilizada para desenvolvimento, permitindo integração com ferramentas e extensões que facilitam o desenvolvimento.

### Backend

- **MQTT (HiveMQ):** Broker MQTT hospedado no HiveMQ Cloud para gerenciar a comunicação em tempo real entre os clientes.
- **JavaScript (Node.js):** Scripts backend para gerenciar a lógica do jogo, incluindo gerenciamento de jogadores, estado do jogo e posicionamento de navios.

### Arquitetura

O sistema segue uma arquitetura cliente-servidor, onde:

- **Clientes (Navegadores):** Cada jogador acessa o jogo através do navegador, enviando e recebendo mensagens via MQTT para interagir com o servidor e outros jogadores.
- **Servidor MQTT:** Gerencia as conexões, tópicos e mensagens, facilitando a comunicação em tempo real entre os clientes.

## Como Funciona

1. **Conexão ao Servidor MQTT:**
   - Ao carregar o jogo, o cliente estabelece uma conexão com o broker MQTT usando credenciais específicas.
   - Uma vez conectado, o cliente pode publicar e assinar tópicos para enviar e receber mensagens.

2. **Entrada na Sala de Jogo:**
   - O jogador insere seu nome e o nome da sala que deseja entrar ou cria uma nova.
   - O cliente publica uma mensagem no tópico correspondente à sala para anunciar a entrada do jogador.
   - Todos os clientes assinados nesse tópico recebem a atualização e adicionam o novo jogador à lista.

3. **Posicionamento de Navios:**
   - Cada jogador posiciona seus navios no tabuleiro interativo.
   - As posições dos navios são enviadas ao servidor via MQTT, garantindo que todos os jogadores tenham o estado atualizado do jogo.

4. **Gameplay:**
   - Alternância de turnos é gerenciada pelo servidor, que notifica os jogadores sobre o turno atual.
   - Ao atacar uma célula, a ação é comunicada via MQTT, e os resultados (acerto ou erro) são atualizados no tabuleiro de todos os jogadores.

5. **Finalização do Jogo:**
   - O jogo continua até que todos os navios de um jogador sejam afundados.
   - O servidor anuncia o vencedor e encerra a partida, permitindo que novos jogos sejam iniciados.

## Design e Pensamento

- **Escalabilidade:** Utilização do protocolo MQTT permite que o sistema escale facilmente para suportar múltiplas salas e jogadores sem comprometer a performance.
- **Modularidade:** Estrutura de código modularizada com ES6 Modules, facilitando a manutenção e extensão das funcionalidades.
- **Experiência do Usuário:** Interface responsiva e interativa foi projetada para ser intuitiva, reduzindo a curva de aprendizado para novos jogadores.
- **Segurança:** Implementação de autenticação básica e gerenciamento seguro de tópicos MQTT para proteger as sessões de jogo.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Backend:** Node.js, MQTT (HiveMQ)
- **Ferramentas:** Visual Studio Code, GitHub Pages

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar este projeto.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.