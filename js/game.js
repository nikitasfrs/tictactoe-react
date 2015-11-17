var Immutable = require('immutable');

/* 
 * Base Tic-Tac-Toe Board API
 *
 */
function Game (numRows, numCols, players) {
    var numRows = this.numRows = numRows || 3,
        numCols = this.numCols = numCols || 3;

    this.totalMoves = numRows * numCols;
    this.moveCounter=0;
    this.gameOver=false;
    this.players=players;

    this.currentPlayer=this.players[0];
    this.writable=true;
    this.winningPlayer = null;

    // construct board right away
    this.board = this.buildBoard(numRows, numCols);

}

/*
 * Builds & initializes board dynamically
 */
Game.prototype.buildBoard = function (numRows, numCols) {
    var rows = [],
        cells, row, col;
    for (row = 0; row < numRows; row++) {
        cells = [];
        for (col = 0; col < numCols; col++) {
            //cells.push({row: row, column: col, value: null});
            cells.push(null);
        }
        rows.push(cells);
    }
    return Immutable.List(rows);
}

Game.prototype.getBoard = function () {
    return this.board.toArray();
}

Game.prototype.getPosValue = function (row, col) {
    //return this.board[row][col].value;
    return this.board[row][col];
}

Game.prototype.markPos = function (row, col) {
    //return this.setPosValue(row, col, this.currentPlayer.getValue());

    return {
        board: this.setPosValue(row, col, this.currentPlayer.getValue()),
        gameOver: this.gameOver,
        winner: this.winningPlayer
    }
    // this should return a state object 
}

Game.prototype.setPosValue = function (row, col, value) {
   var result, rowArr;

   // In case we run out of free positions or 
   // specified position is not empty return false
   if (this.gameIsOver() ||
       !this.hasMoreMoves() ||
        this.posIsTaken(row, col)) {
       return false;
   }



   // get row array from the Immutable List
   // replace column value and set edited array
   // back to list resulting a new Immutable List object
   rowArr = this.board.get(row);
   rowArr[col] = value;
   this.board = this.board.set(row, rowArr);


   // increment counter, change player, see if anyone wins 
   this.incrementCounter().togglePlayer().checkForWin();

   // return board?
   return this.getBoard();
}


Game.prototype.hasMoreMoves = function () {
    return this.moveCounter < this.totalMoves;
}

Game.prototype.incrementCounter = function () {
    this.moveCounter+=1;
    return this;
}

Game.prototype.posIsTaken = function (row, col) {
    //return this.board[row][col].value !== null;
    return this.board.get(row)[col] !== null;
}

Game.prototype.gameIsOver = function () {
    return this.gameOver;
}

Game.prototype.checkForWin = function () {
    //TODO
    // return an array of respective row/column objects
    //
    if (this.winningPlayer) {
        return true;
    } else {

        // set gameIsOver to true
        // and this.winningPlayer
        return false;
    }
}

Game.prototype.getCurrentPlayer = function() {
    return this.currentPlayer;
}

Game.prototype.togglePlayer = function() {
    if (this.currentPlayer.name === this.players[0].name) {
        this.currentPlayer = this.players[1];
    } else {
        this.currentPlayer = this.players[0];
    }
    return this;
}

function Player(name, value) {
    // attrs must be unique
    this.name = name;
    this.value = value;
}

Player.prototype.getName = function () {
    return this.name;
}

Player.prototype.getValue = function() {
    return this.value;
}


module.exports.Game = Game;
module.exports.Player = Player;
