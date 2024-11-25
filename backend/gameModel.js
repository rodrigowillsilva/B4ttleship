//const mqtt = require('mqtt');

// Definição da classe Game
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ship {
    constructor(playerId, x, y, name) {
        this.playerId = playerId;
        this.point = new Point(x, y);
        this.name = name;
    }
}

class Game {
    constructor(gameId) {
        this.gameId = gameId;
        this.players = new Array(4).fill(undefined);  
        this.turn = 0;
        this.board = new Array(10).fill(0).map(() => new Array(10).fill(0).map(() => new Array(4).fill(0)));
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

// Exportando a classe Game e o array gameModels
const gameModels = {
    Game,
    Ship,
    Point,
    Player
};

export default gameModels;