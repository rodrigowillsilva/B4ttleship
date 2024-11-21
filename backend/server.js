//const mqtt = require('mqtt');
import { connectMQTT, subscribeToTopic, publishMessage, unsubscribeFromTopic } from './mqttServices.js';
import { Game, Player, games } from './gameModel.js';

// Conecte-se ao HiveMQ
connectMQTT();

// subscreva no topico teste para testarmos no site do github pages
subscribeToTopic('teste', (topic, body) => {
    console.log(`Mensagem recebida no tópico ${topic}: ${body.toString()}`);
});

// function findGame(gameId, player, goToGameBoardCallback) {
//     const game = games.find(game => game.gameId === gameId);

//     // Se o jogo com o gameId fornecido não existir, crie um novo jogo
//     if (game === undefined) {
//         const newGame = new Game(gameId, player);
//         games.push(newGame);

//         // Inscreva-se no tópico do jogo
//         subscribeToTopic(`B4ttle/${gameId}/jogada`, (topic, message) => {
//             // Host processa os movimentos dos jogadores 
//         });

//         // // Inscreva-se no tópico de descoberta do jogo
//         // subscribeToTopic(`B4ttle/${gameId}/descoberta`, (topic, message) => {
//         //     const [action, playerInfo] = message.toString().split(' ');
//         //     const player = new Player(playerInfo.id, playerInfo.name);

//         //     games.find(game => game.gameId === gameId).addPlayer(player);
//         // });
//     }
//     else {
//         game.addPlayer(player);
//     }

//     // Inscreva-se no tópico do jogo
//     subscribeToTopic(`B4ttle/${gameId}/estado`, (topic, message) => {
//         // Para jogadores receberem o estado do jogo do host e atualizarem seu front-end
//     });


//     // subscribeToTopic(`B4ttle/${gameId}/stado`, (topic, body) => {
//     //     // Para jogadores receberem o estado do jogo do host
//     // });

//     // subscribeToTopic(`B4ttle/${gameId}/descoberta`, (topic, body) => {
//     //     const [action, message] = body.toString().split(' ');
//     //     const playerInfo = JSON.parse(message);
//     //     const player = new Player(playerInfo.id, playerInfo.name);
//     //     //const curGame = games.find(game => game.gameId === gameId);

//     //     if (playerId === playerInfo.id) {
//     //         return;
//     //     }

//     //     if (action === 'ProcurarJogo') {
//     //         game.players.push({ id: playerId, name: playerName });
//     //         publishMessage(`B4ttle/${gameId}/descoberta`, `JogoEncontrado ${playerInfo.id}`);

//     //         if (game.players.length >= 4) {
//     //             unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);
//     //             startGame();s
//     //         }
//     //     }
//     //     else if (action === 'JogoEncontrado') { 
//     //         playerInfo.type = 'guest';
//     //         unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);
//     //         goToGameBoardCallback();
//     //     }

//     // });

//     // publishMessage(`B4ttle/${gameId}/descoberta`, `ProcurarJogo ${JSON.stringify(playerInfo)}`); 

//     // setTimeout(() => {
//     //     if (playerInfo.type === 'host') {
//     //         // unsubscribeFromTopic(`B4ttle/${gameId}/descoberta`);

//     //         // Comnfigura um novo jogo
//     //         subscribeToTopic(`B4ttle/${gameId}/jogada`, (topic, message) => {
//     //             // Processa o movimento do jogador
//     //         });

//     //         game.id = gameId;
//     //         game.players = [playerInfo];
//     //         game.turn = 0;
//     //         game.board = [];
//     //         game.ships = [];
//     //         game.gameStatus = 'waiting';
//     //         game.winner = '';
//     //         game.messages = [];

//     //         playerInfo.name = 'Player 1';

//     //         goToGameBoardCallback();

//     //     }
//     // }, 3000);
// }


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