function encoder(pinA, pinB, board) {
    this.pinA = pinA;
    this.pinB = pinB;
    this.board = board;

    var encPinA = this.board.pin(this.pinA, 'DIGITAL', 'PULLUP');
    var encPinB = this.board.pin(this.pinB, 'DIGITAL', 'PULLUP');

    var encPos = 0;
    var encPinBCurState;
    var encPinALastState = 0;

    encPinA.read(onChangeState);
    encPinB.read(function (val) { encPinBCurState = val });

    function onChangeState(encPinAState) {
        if ((encPinALastState == 0) && (encPinAState == 1)) {
            if (encPinBCurState == 0)
                encPos--;
            else
                encPos++;
        }
        encPinALastState = encPinAState;
    }

    this.getPos = function () {
        return encPos;
    };

    this.setPos = function (val) {
        encPos = val;
    };
}