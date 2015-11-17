var Immutable = require('immutable');

/* 
 * Base Tic-Tac-Toe Board API
 *
 */
function Game (players) {
    var numRows = this.numRows = numRows || 3,
        numCols = this.numCols = numCols || 3;

    this.totalMoves = numRows * numCols;
    this.moveCounter=0;
    this.gameOver=false;
    this.players=players;

    this.currentPlayer=this.players[0];
    this.writable=true;
    this.winningPlayer = null;

    this.wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]];

    this.board = this.initBoard();

}

/*
 * Builds & initializes board dynamically
 */
Game.prototype.initBoard = function () {
    return Immutable.List([
        null, null, null,
        null, null, null,
        null, null, null
    ]);
}

/**
 * Helper that transforms row/column values to 
 * corresponding indices for easy array access.
 */
Game.prototype._getSingleIndex = function (row, col) {
    var offset, result;

    offset = row * 3;
    result = col % 3 + offset; 
    return result;
}


Game.prototype.getBoard = function () {
    return this.board.toArray();
}

Game.prototype.markPos = function (row, col) {
    var idx = this._getSingleIndex(row, col),
        value = this.currentPlayer.getValue(),
        newList, that=this,
        win;

    // make new move and scan board
    // to find winning combo
    winCombo = this._setPosValue(idx,value).findWinner();

    //TODO 
    //if we have a winner
    //replace all winning positions with {value: X/O, hot:true}
    //objects

    if (winCombo.length == 3) {
        
        winCombo.forEach(function(idx) {
            var currentValue = this.board.get(idx);
            this.board = this.board.set(idx, {
                value: currentValue,
                hot:true
            }); 

        }.bind(this));
/*
        newList = this.board.withMutations(function(list) {
            winCombo.forEach(function(idx) {
                var currentValue = list.get(idx);
                list.set(idx, {
                    value: currentValue,
                    hot:true
                }); 

            }.bind(that))
        }
        this.board = newList;*/
    }

    return {
        board: this.getBoard(),
        gameOver: this.gameOver,
        winner: this.winningPlayer,
        winCombo: winCombo
    }
    // this should return a state object 
}

Game.prototype._setPosValue = function (idx, value) {
   //var result, rowArr, idx;

   // In case we run out of free positions or 
   // specified position is not empty return false
   if (this.gameIsOver() ||
       !this.hasMoreMoves() ||
        this.posIsTaken(idx)) {
       return false;
   }
 
   this.board = this.board.set(idx, value);

   // returns this 
   return this.incrementCounter().togglePlayer();
}


Game.prototype.hasMoreMoves = function () {
    return this.moveCounter < this.totalMoves;
}

Game.prototype.incrementCounter = function () {
    this.moveCounter+=1;
    return this;
}

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
}

Game.prototype.posIsTaken = function (idx) {
    //return this.board[row][col].value !== null;
    return this.board.get(idx) !== null;
}

Game.prototype.gameIsOver = function () {
    return this.gameOver;
}

Game.prototype.findWinner = function () {
    //TODO
    // return an array of respective row/column objects

    // helper for easy array access
    var s = function (index) {
        return this.board.get(index);
    }.bind(this);

    var w = this.wins;

    if (this.winningPlayer) {
        return true;
    } else {

        for (var i = 0; i < 8; i++) {
            if (s(w[i][0]) === s(w[i][1]) 
            && s(w[i][0]) === s(w[i][2]) 
            && s(w[i][0]) != null) {

                //return s(w[i][0]);
                return w[i];
            }
        }

        // set gameIsOver to true
        // and this.winningPlayer
        return [];
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
