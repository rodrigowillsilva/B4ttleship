import mqttServices from './mqttServices.js';
import gameModels from './gameModel.js';

const { connectMQTT, subscribeToTopic, publishMessage, unsubscribeFromTopic } = mqttServices;
const { Game, Player, games } = gameModels;

const playerInfo = new Player("playerId", "playerName");
const game = new Game("gameId");

// Conecte-se ao HiveMQ
export function InicializaConexaoMQTT() {
    connectMQTT();

    // subscreva no topico teste para testarmos no site do github pages
    subscribeToTopic('teste', (body) => {
        console.log(`Mensagem recebida: ${body.toString()}`);
    });
}

export function ProcurarJogo(gameId, playerName, goToGameBoardCallback) {
    playerInfo.id = Math.random().toString(16);
    playerInfo.name = playerName;

    game.id = gameId;

    subscribeToTopic(`B4ttle/${gameId}/descoberta`, (body) => {
        const [action, message] = body.toString().split(' ');
        console.log(`Action: ${action}, Message: ${message}`);
        const messagePlayerInfo = JSON.parse(message);
        console.log(`Message Player Info: ${messagePlayerInfo}`);
        const player = new Player(messagePlayerInfo.id, messagePlayerInfo.name);

        if (playerInfo.id === messagePlayerInfo.id) {
            return;
        }

        if (action === 'ProcurarJogo') {
            game.players.push(player);
            console.log(`Jogador ${player.name} entrou no jogo`);
            console.log(`${JSON.stringify(playerInfo)}`);
            publishMessage(`B4ttle/${gameId}/descoberta`, `JogoEncontrado ${JSON.stringify(playerInfo)}`);

            if (game.players.length >= 4) {
                unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);
                startGame();
            }
        }
        else if (action === 'JogoEncontrado') {
            if (game.host !== undefined) {
                return;
            }
            game.host = messagePlayerInfo;
            unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);
            goToGameBoardCallback();

            // Inscreva-se no tópico do jogo
            subscribeToTopic(`B4ttle/${gameId}/estado`, (message) => {
                // Para jogadores receberem o estado do jogo do host e atualizarem seu front-end
            });

            subscribeToTopic(`B4ttle/${gameId}/chat`, (message) => {
                // Processa as mensagens do chat
                console.log(`Mensagem recebida: ${message.toString()}`);

            });
        }

    });

    publishMessage(`B4ttle/${gameId}/descoberta`, `ProcurarJogo ${JSON.stringify(playerInfo)}`);

    setTimeout(() => {
        if (game.host === undefined) {
            // unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);

            // Comnfigura um novo jogo
            subscribeToTopic(`B4ttle/${gameId}/jogada`, (message) => {
                // Processa o movimento do jogador
            });

            game.id = gameId;
            game.players = [playerInfo];
            game.host = playerInfo;
            game.turn = 0;
            game.board = [];
            game.ships = [];
            game.gameStatus = 'waiting';
            game.winner = '';
            game.messages = [];

            //playerInfo.name = 'Player 1';

            goToGameBoardCallback();
            subscribeToTopic(`B4ttle/${gameId}/chat`, (message) => {
                // Processa as mensagens do chat
                console.log(`Mensagem recebida: ${message.toString()}`);

            });

        }
    }, 3000);
}

export function PublicarMensagem(topic, message) {
    publishMessage(`B4ttle/${topic}/chat`, message);
}

function startGame() {
    // Inicializa a gameplay do jogo
}



// // Defina os dados da sua conexão HiveMQ
// const protocol = 'mqtts';
// const host = '84022148914b475995eb5a668608ef9b.s1.eu.hivemq.cloud'; // Substitua pelo seu Broker URL
// const port = '8883';
// const client_Id = `mqtt_${Math.random().toString(16).slice(3)}`;
// const connectUrl = `${protocol}://${host}:${port}`;
// const username = 'B4ttleship'; // Seu nome de usuário
// const password = 'B4ttle123'; // Sua senha

// // Conectar ao HiveMQ
// const client = mqtt.connect(connectUrl, {
//     clientId: client_Id,
//     username: username,
//     password: password,
//     // port: 8883,
//     rejectUnauthorized: false, // Para ignorar erros de certificado SSL (importante para a primeira conexão)
// });

// client.on('connect', () => {
//     console.log('Conectado ao HiveMQ!');
//     // Inscrever-se no tópico `game/descoberta`
//     client.subscribe(['game/discover'], (err) => {
//         if (err) {
//             console.log('Erro ao se inscrever:', err);
//         } else {
//             console.log('Inscrito com sucesso no tópico game/discover');
//         }
//     });
// });

// client.on('message', (topic, message) => {
//     console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
// });

// client.on('error', (err) => {
//     console.log('Erro de conexão:', err);
// });