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

module.exports = Player;
