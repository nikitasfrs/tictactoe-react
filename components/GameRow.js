module.exports = function gameRowFactory(opt) {
    var React = opt.React || null,
        GameCell = opt.GameCell || null;

    return function (props) {
        var row = props.data.row, cells;
        cells = row.map(function(cell, idx) {
            var className='', value=cell;
            if (cell != null && cell.hot) {
               value = cell.value;
               className='hot';
            } else if (cell) {
                className='notEmpty';
            } 
            return (<GameCell key={idx} value={value} className={className} />);
        });

        return (
            <tr>{ cells }</tr>
        );
    };
};
