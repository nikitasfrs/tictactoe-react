/**
 *
 * Reactive Tic-Tac-Toe UI
 * Author: Nikitas Frantzeskakis
 *
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Game = require('./game').Game;
var Player = require('./game').Player;

var players = [
    new Player('Player 1', 'X'),
    new Player('Player 2', 'O')
];

var game = new Game(players);


// Top-Level state-holding component
var TicTacToe = React.createClass({
    getInitialState: function() {
        this.initGame = this.props.initGame;

        return {
            board: this.initGame.getBoard(),
            gameOver: false,
            winner: null
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {

        // we owe the simplicity of this to the
        // Immutable data structure used in Game object
        return this.state.board !== nextState.board;
    },

    cellClickAction: function (e) {
        var col = e.target.cellIndex,
            row = e.target.parentNode.rowIndex,
            text = e.target.textContent,
            gameOver = this.state.gameOver, newState;

        // check if space between cell borders was 
        // clicked or current cell is not empty
        if (row >= 0 && col >= 0 &&
            !text && !gameOver) {

            newState = this.initGame.markPos(row, col);
            this.setState(newState);
        }
        
        // proper react synthetic-event way
        // to bubble no further up the DOM tree
        e.stopPropagation();
    },
    controlsClickAction: function(e) {
        var newState, className = e.target.className;
        e.preventDefault();
        if (className == "playAgain") {
           newState = this.props.initGame.resetGame();
           this.setState(newState);
        }
        e.stopPropagation();
    },
    render: function() {
        var controls = '', className = '',
            dataBoard = dataControls = {};

        if (this.state.gameOver) {
            className = 'over';
            dataControls = {
                winner: this.state.winner,
                clickHandler: this.controlsClickAction
            }
            controls = (<GameControls data={dataControls} />);
        }

        dataBoard = { 
            className: className,
            board: this.state.board,
            clickHandler: this.cellClickAction
        };

        return (
            <div id="wrapper">
                <GameBoard data={dataBoard} />
                { controls }
            </div>
        );
    }
});

// a stateless function component
var GameBoard = function(props) {
    var data, gameRows=[], key=0,
        className = props.data.className,
        board = props.data.board,
        clickHandler = props.data.clickHandler; 

    // break sequential array into 
    // 3 smaller arrays to be rendered as rows
    for (var i = 0; i < 9; i+=3) {
        data = {
            row: board.slice(i, i+3)
        }
        gameRows.push(<GameRow key={key} data={data} />);
        key+=1;
    }
    return (
        <table id="board" className={className} onClick={clickHandler} >
            <tbody>
                { gameRows }
            </tbody>
        </table>
    );
}

var GameRow = function (props) {
    var row = props.data.row;
    
    return (
        <tr>{ createCells(row) }</tr>
    );

    function createCells (row) {
        var cells=[];
        row.forEach(function(cell, idx) {
            var className='', value=cell;
            if (cell != null && cell.hot) {
               value = cell.value;
               className='hot';
            } else if (cell) {
                className='notEmpty';
            } 
            cells.push(<GameCell key={idx} value={value} className={className} />);
        }.bind(this));

        return cells;
    }
};

var GameCell = function (props) {
    return (<td className={props.className}>{props.value}</td>);
};

var GameControls = function(props) {
    var winner = props.data.winner,
        str=notification='', elems,
        clickHandler = props.data.clickHandler,
        playAgain;

    playAgain = <a href="#" className="playAgain" onClick={clickHandler}>Play again</a>;
    if (winner) {
        str=winner + ' won!';
        elems = <p><strong>{str}</strong> {playAgain} </p>
    } else {
        str="Draw. No one wins :( "
        elems = <p>{str}{playAgain}</p>
    }

    return (<div id="controls">{ elems }</div>);
}

ReactDOM.render(
    <TicTacToe initGame={game}/>,
    document.getElementById('app')
);
