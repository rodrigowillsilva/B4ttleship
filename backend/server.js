import mqttServices from './mqttServices.js';
import gameModels from './gameModel.js';

const { connectMQTT, subscribeToTopic, publishMessage, unsubscribeFromTopic } = mqttServices;
const { Game, Player, Ship, Point } = gameModels;

const playerInfo = new Player(0, "playerName");
const game = new Game("gameId");

const connectionTimers = new Array(4).fill(0);

// Conecte-se ao HiveMQ
export function InicializaConexaoMQTT() {
    connectMQTT();

    // subscreva no topico teste para testarmos no site do github pages
    subscribeToTopic('teste', (body) => {
        console.log(`Mensagem recebida: ${body.toString()}`);
    });
}

export function ProcurarJogo(gameId, playerName, goToGameBoardCallback) {
    playerInfo.id = Math.floor(Math.random() * 10000000);
    playerInfo.name = playerName;

    game.id = gameId;

    subscribeToTopic(`B4ttle/${gameId}/descoberta`, (body) => {
        const [action, message] = body.toString().split(' ');
        const messagePlayerInfo = JSON.parse(message);
        const player = new Player(messagePlayerInfo.id, messagePlayerInfo.name);

        console.log(`check 1`);

        if (playerInfo.id === messagePlayerInfo.id) {
            return;
        }

        console.log(`passou aqui`);

        if (action === 'ProcurarJogo') {
            game.players.push(player);
            console.log(`Jogador ${player.name} entrou no jogo`);
            // console.log(`${JSON.stringify(playerInfo)}`);
            connectionTimers.fill(1);

            let n = 0;
            for (let i = 1; i < 4; i++) {
                if (game.players[i] === undefined) {
                    n = i;
                    break;
                }
            }

            publishMessage(`B4ttle/${gameId}/descoberta`, `JogoEncontrado ${JSON.stringify(playerInfo)} ${n}`);

            if (game.players.length >= 4) {
                unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);
                startGame();
            }
        }
        else if (action === 'JogoEncontrado') {
            if (game.host !== undefined) {
                return;
            }

            console.log(`Jogo encontrado!`);

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

            function updateConnectionTimer() {
                // Atualiza o connectionTimer do jogador a cada 1 segundo
                publishMessage(`B4ttle/${gameId}/timer`, JSON.stringify(playerInfo));
                setTimeout(updateConnectionTimer, 1000); // Call itself after 1 second
            }

            // Start the recursive calls
            setTimeout(updateConnectionTimer, 1000);

        }

    });

    setTimeout(publishMessage(`B4ttle/${gameId}/descoberta`, `ProcurarJogo ${JSON.stringify(playerInfo)}`), 1000);

    setTimeout(() => {
        if (game.host === undefined) {
            // unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);
            console.log(`Nenhum jogo encontrado. Criando um novo jogo...`);

            // Comnfigura um novo jogo
            subscribeToTopic(`B4ttle/${gameId}/jogada`, (message) => {
                // Processa o movimento do jogador
                const [action, body] = message.toString().split(' ');
                console.log(`Action: ${action}, Body: ${body}`);
                switch (action) {
                    case 'SairDoJogo':
                        const playerInfo = JSON.parse(body);

                        // Remove todos os navios do jogador do tabuleiro x, y e Ship
                        for (let i = 0; i < 10; i++) {
                            for (let j = 0; j < 10; j++) {
                                if (game.board[i][j][playerInfo.id] === 1) {
                                    game.board[i][j][playerInfo.id] = 0;
                                }
                            }
                        }

                        // Setar o jogador como undefined
                        for (let i = 1; i < 4; i++) {
                            if (game.players[i] !== undefined) {
                                if (game.players[i].id === playerInfo.id) {
                                    game.players[i] = undefined;
                                }
                            }
                        }
                        console.log(`Jogador ${playerInfo.name} saiu do jogo`);
                        // Se o jogador que saiu for o host, selecione um novo host

                        break;
                    default:
                        break;
                }
            });

            // subscreva no topico de timer de conexao
            subscribeToTopic(`B4ttle/${gameId}/timer`, (message) => {
                const massegePlayerInfo = JSON.parse(message);

                for (let i = 1; i < 4; i++) {
                    if (game.players[i] !== undefined) {
                        if (game.players[i].id === massegePlayerInfo.id) {
                            connectionTimers[i] = 1;
                            console.log(`Player ${game.players[i].name} está conectado`);
                        }
                    }
                }
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

            function CheckConnection() {
                console.log(`Checking connection...`);
                for (let i = 1; i < 4; i++) {
                    if (game.players[i] !== undefined) {
                        if (connectionTimers[i] === 0) {
                            // Desconecta o jogador
                            DesconectarJogador(game.players[i]);
                            console.log(`Player ${game.players[i].name} desconectado`);
                        }
                        connectionTimers[i] = 0;
                    }
                }

                setTimeout(CheckConnection, 3000);
            }

            setTimeout(CheckConnection, 3000);


        }
    }, 3000);
}

export function DesconectarJogador(player) {
    // Desconecta o jogador
    publishMessage(`B4ttle/${game.gameId}/jogada`, `SairDoJogo ${JSON.stringify(player)}`);
}


export function SairDoJogo() {
    // Desconecta do jogo
    publishMessage(`B4ttle/${game.gameId}/jogada`, `SairDoJogo ${JSON.stringify(playerInfo)}`);
}

export function PublicarMensagem(topic, message) {
    publishMessage(`B4ttle/${game.gameId}/${topic}`, message);
}

export function PrintGameInfo() {
    console.log(`Game Info: ${JSON.stringify(game)}`);
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