//const mqtt = require('mqtt');

// Definição da classe Game
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Game {
    constructor(gameId, host) {
        this.gameId = gameId;
        this.host = host;
        this.players = [host];
        this.turn = 0;
        this.board = [];
        this.ships = [];
        this.gameStatus = 'waiting';
        this.winner = '';
        this.messages = [];

        this.players.push(host);
    }

    // Métodos para controlar o jogo podem ser adicionados aqui
    addPlayer(player) {
        this.players.push(player);
    }

    // Outros métodos conforme necessário
}

// Array para armazenar os jogos
const games = [];

// Exportando a classe Game e o array games
module.exports = { Game, Player, games };