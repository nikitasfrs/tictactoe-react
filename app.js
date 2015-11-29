/**
 *
 * Reactive Tic-Tac-Toe UI
 * Author: Nikitas Frantzeskakis
 *
 */

var React = require('react'),
    ReactDOM = require('react-dom'),
    Game = require('./models/game'),
    Player = require('./models/player'),
  
    GameControls = require('./components/GameControls')({
        React: React
    }),
    GameCell = require('./components/GameCell')({
        React: React
    }),
    GameRow = require('./components/GameRow')({
        React: React,
        GameCell: GameCell
    }),
    GameBoard = require('./components/GameBoard')({
        React: React,
        GameRow: GameRow
    }),
    TicTacToe = require('./components/TicTacToe')({
        React: React,
        GameBoard: GameBoard,
        GameControls: GameControls
    }),

    players = [
        new Player('Player 1', 'X'),
        new Player('Player 2', 'O')
    ],
    game = new Game(players);

ReactDOM.render(
    <TicTacToe initGame={game}/>,
    document.getElementById('app')
);

