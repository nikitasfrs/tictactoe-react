describe('App', function () {
    describe('TicTacToe', function () {
        var TicTacToe;
        var Game, game;
        var Player, players;

        before(function() {
            TicTacToe = require('../js/app.js').TicTacToe;
            Game = require('../js/game.js').Game;
            Player = require('../js/player.js').Player;

            players = [
                new Player('Player 1', 'X'),
                new Player('Player 2', 'O')
            ];

            game = new Game(players);
        })

    });
        
});
