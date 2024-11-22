//const mqtt = require('mqtt');

// Definição da classe Game
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Game {
    constructor(gameId) {
        this.gameId = gameId;
        this.host = undefined;
        this.players = [];
        this.turn = 0;
        this.board = [];
        this.ships = [];
        this.gameStatus = 'waiting';
        this.winner = '';
        this.messages = [];

        //this.players.push(host);
    }

    // Métodos para controlar o jogo podem ser adicionados aqui
    addPlayer(player) {
        this.players.push(player);
    }

    // Outros métodos conforme necessário
}

// Array para armazenar os jogos
const games = [];

// Exportando a classe Game e o array gameModels
const gameModels = {
    Game,
    Player,
    games
};

export default gameModels;