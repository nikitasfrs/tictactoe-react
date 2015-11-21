var Immutable = require('immutable');

/** 
 * Base Tic-Tac-Toe Board API
 * Author: Nikitas Frantzeskakis
 *
 */
function Game (players) {

    this.players=players;
    this.wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]];

    this.resetGame();
}

/*
 * Builds & initializes board 
 */
Game.prototype.resetGame = function () {
    
    var NUMROWS = 3,
        NUMCOLS = 3;

    this.totalMoves = NUMROWS * NUMCOLS;
    this.moveCounter=0;
    this.gameOver=false;

    this.currentPlayer=this.players[0];
    this.writable=true;
    this.winner = null;

    this.board = Immutable.List([
        null, null, null,
        null, null, null,
        null, null, null
    ]);

    return this.getGameState();
};

Game.prototype.getBoard = function () {
    return this.board.toArray();
};

Game.prototype.markPos = function (row, col) {
    var idx = this._getSingleIndex(row, col),
        value = this.currentPlayer.getValue(),
        newList, win, written, winner;

    // make new move and scan board
    // to find winning combo

    written = this._setPosValue(idx,value);
    winCombo = this._scanBoard();
    winner = this._playerWithSign(winCombo[0]);

    if (winner && winCombo.length == 3) {
        this.winner = winner.getName();

        this.gameOver=true;
        
        // we're using withMutations to batch all 
        // operations for performance and reassign
        // this.board object reference at the end

        newList = this.board.withMutations(function(list) {
            winCombo.map(function(idx) {
                var currentValue = list.get(idx);

                // replace all winning array items with
                // objects like {value:'X', hot: true}
                // to be identified by UI code

                // we will call positions that are part 
                // of a winning combination 'hot'
                
                list.set(idx, {
                    value: currentValue,
                    hot:true
                }); 
            });
        });

        this.board = newList;
  
    } else if (!this._hasMoreMoves()) {
        // game finished with no winner 
        this.gameOver=true;
    }


    // return the updated game state object
    return this.getGameState();    
};

Game.prototype.getGameState = function () {
    return {
        board: this.getBoard(),
        gameOver: this.gameOver,
        winner: this.winner  
    };
}

// Helper returns the player that the 
// cell value/mark belongs to
Game.prototype._playerWithSign = function(idx) {
   var player1Val = this.players[0].getValue(),
       player2Val = this.players[1].getValue(),
       cellValue =  this.board.get(idx);

   if (cellValue == player1Val) {
       return this.players[0];
   } else if (cellValue == player2Val){
       return this.players[1];
   } else {
       // normally this should not occur
       return false;
   }
};

Game.prototype._setPosValue = function (idx, value) {
   //var result, rowArr, idx;

   // In case we run out of free positions or 
   // specified position is not empty return false
   if (this._gameIsOver() ||
       !this._hasMoreMoves() ||
        this._posIsTaken(idx)) {
       return false;
   }
 
   this.board = this.board.set(idx, value);

   // returns this 
   return this._incrementCounter().togglePlayer();
};

Game.prototype._hasMoreMoves = function () {
    return this.moveCounter < this.totalMoves;
};

Game.prototype._incrementCounter = function () {
    this.moveCounter+=1;
    return this;
};

/**
 * Helper that transforms row/column values to 
 * corresponding indices for easy array access.
 */
Game.prototype._getSingleIndex = function (row, col) {
    var offset, result;

    offset = row * 3;
    result = col % 3 + offset; 
    return result;
};

/**
 * Inverse of _getSingleIndex utility function
 *
 */
Game.prototype._getDimensions = function(idx) {
    var offset, row=0, col;
    
    if (idx < 3) {
        row = 0;
    } else if (idx < 6) {
        row = 1;
    } else if (idx < 9) {
        row = 2;
    }

    col = idx % 3;
    return {row:row, col:col};
};

Game.prototype._posIsTaken = function (idx) {
    //return this.board[row][col].value !== null;
    return this.board.get(idx) !== null;
};

Game.prototype._gameIsOver = function () {
    return this.gameOver;
};

Game.prototype._scanBoard = function () {

    var s = function (index) {
    // helper for easy array access
        return this.board.get(index);
    }.bind(this);

    var w = this.wins;

    if (this.winner) {
        return true;
    } else {
        // This section was inspired by:
        // http://mkuklis.github.io/tictactoe/docs/tictactoe.html

        for (var i = 0; i < 8; i++) {
            if (s(w[i][0]) === s(w[i][1]) 
            && s(w[i][0]) === s(w[i][2]) 
            && s(w[i][0]) != null) {

                //return s(w[i][0]);
                return w[i];
            }
        }
        return [];
    }
};

Game.prototype.getCurrentPlayer = function() {
    return this.currentPlayer;
};

Game.prototype.togglePlayer = function() {
    if (this.currentPlayer.name === this.players[0].name) {
        this.currentPlayer = this.players[1];
    } else {
        this.currentPlayer = this.players[0];
    }
    return this;
};

function Player(name, value) {
    // attrs must be unique
    this.name = name;
    this.value = value;
}

Player.prototype.getName = function () {
    return this.name;
};

Player.prototype.getValue = function() {
    return this.value;
};

module.exports.Game = Game;
module.exports.Player = Player;
