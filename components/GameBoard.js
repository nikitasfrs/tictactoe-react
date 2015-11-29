module.exports = function gameBoardFactory (opt) {
    var React = opt.React || null,
        GameRow = opt.GameRow || null;

    return function(props) {
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
};
