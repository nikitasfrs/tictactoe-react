module.exports = function gameControlsFactory(opt) {
    var React = opt.React || null;

    return function(props) {
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
    };
};
