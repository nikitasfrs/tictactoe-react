module.exports = function gameCellFactory(opt) {
    var React = opt.React || null;

    return function (props) {
        return (<td className={props.className}>{props.value}</td>);
    };
};
