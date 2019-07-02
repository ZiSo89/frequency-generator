function analog(pin, board) {
    this.pin = pin;
    this.board = board;

    var value = 0;
    var threshold = 5;
    var overThres = false;

    var ana = this.board.pin(this.pin, 'ANALOG', 'INPUT');

    ana.read(function (val) {

        var diff = 0;
        var curValue = val;
        if (value > curValue)
            diff = value - curValue;
        else
            diff = curValue - value;

        if (diff >= threshold) {
            overThres = true;
            value = curValue;
        } else
            overThres = false;

    });

    this.setVal = function (val) {
        value = val;
    };

    this.getVal = function () {
        return value;
    };

    this.overThreshold = function () {
        return overThres;
    };

}