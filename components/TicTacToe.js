module.exports = function ticTacToeFactory (opt) {
    var React = opt.React || null,
        GameBoard = opt.GameBoard || null,
        GameControls = opt.GameControls || null;

    return React.createClass({
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
        boardClickAction: function (e) {
            var col = e.target.cellIndex,
                row = e.target.parentNode.rowIndex,
                text = e.target.textContent,
                gameOver = this.state.gameOver, newState;

            // when empty cells get clicked
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
                clickHandler: this.boardClickAction
            };

            return (
                <div id="wrapper">
                    <GameBoard data={dataBoard} />
                    { controls }
                </div>
            );
        }
    });
};
