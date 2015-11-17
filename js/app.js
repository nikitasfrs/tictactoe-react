var React = require('react');
var ReactDOM = require('react-dom');

var Game = require('./game').Game;
var Player = require('./game').Player;


var players = [
    new Player('Player 1', 'X'),
    new Player('Player 2', 'O')
];

var game = new Game(3,3, players);


// Top-Level state-holding component
var GameBoard = React.createClass({
    getInitialState: function() {
        this.initialGame = this.props.initialGame;

        return {
            board: this.initialGame.getBoard()
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
            newBoard;

        // check if space between cell borders was 
        // clicked or current cell is not empty
        if (row >= 0 && col >= 0 && !text ) {
            console.log('col: ' + col);
            console.log('row: ' + row);

            newBoard = this.initialGame.markPos(row, col);

            this.setState({
                board: newBoard
            });
        }
        
        // proper react synthetic-event way
        // to bubble no further up the DOM tree
        e.stopPropagation();
    },

    render: function() {
       return (
           <table id="board" onClick={this.clickHandler}>
                <tbody>
                    { getChildren(this.state.board) }
                </tbody>
            </table>
        );

        // small helper for readability
        function getChildren(board) {
            var rows=[];

            board.forEach(function (r, idx) {
                rows.push(<GameRow key={'row-'+idx} row={r} />);
            }.bind(this));

            return rows;
        }
    }
});

// a stateless function component
var GameRow = function (props) {
    
    return (
        <tr>{ getChildren(props.row) }</tr>
    );

    function getChildren (row) {
        var cells=[];
        
        row.forEach(function(cell, idx) {
            var className='';
            if (cell) {
                className='notEmpty';
            }
            cells.push(<GameCell key={'cell-'+idx} value={cell} className={className} />);
        }.bind(this));

        return cells;
    }
};

var GameCell = function (props) {
    return (<td className={props.className}>{props.value}</td>);
};

ReactDOM.render(
    <GameBoard initialGame={game}/>,
    document.getElementById('app')
);
