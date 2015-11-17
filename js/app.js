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
        this.initialGame = this.props.initialGame;

        return {
            board: this.initialGame.getBoard(),
            gameOver: false,
            winner: null,
            winCombo: []
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {

        // we owe the simplicity of this to the
        // Immutable data structure used in Game object
        return this.state.board !== nextState.board;
    },

    clickHandler: function (e) {
        var col = e.target.cellIndex,
            row = e.target.parentNode.rowIndex,
            text = e.target.textContent,
            newState;

        // check if space between cell borders was 
        // clicked or current cell is not empty
        if (row >= 0 && col >= 0 && !text ) {

            newState = this.initialGame.markPos(row, col);
            this.setState(newState);
        }
        
        // proper react synthetic-event way
        // to bubble no further up the DOM tree
        e.stopPropagation();
    },

    render: function() {
        return (
            <table id="board" onClick={this.clickHandler}>
                <GameBoard board={this.state.board} winCombo={this.state.winCombo} />
            </table>
        );
    }
});


var GameBoard = function(props) {
    var data, gameRows=[], key=0;;

    for (var i = 0; i < 9; i+=3) {
        data = {
            row: props.board.slice(i, i+3)
        }
        gameRows.push(<GameRow key={key} data={data} />);
        key+=1;
    }

    return (
        <tbody>
            { gameRows }
        </tbody>
    );

    
}

// a stateless function component
var GameRow = function (props) {
    var row = props.data.row,
        //hot = props.data.hot;
        hot=false;
    //console.log(hot)
    
    return (
        <tr>{ createCells(row) }</tr>
    );

    function createCells (row) {
        var cells=[];
        
        row.forEach(function(cell, idx) {
            var className='';
            if (typeof cell === 'object' && cell !== null) {
               hot=true;
               console.log(cell);
               cell = cell.value;
            }
                
            else if (cell) {
                className='notEmpty';
            } 

            if (hot) {
                className='hot';
            }

            cells.push(<GameCell key={idx} value={cell} className={className} />);
        }.bind(this));

        return cells;
    }
};

var GameCell = function (props) {
    return (<td className={props.className}>{props.value}</td>);
};

ReactDOM.render(
    <TicTacToe initialGame={game}/>,
    document.getElementById('app')
);
