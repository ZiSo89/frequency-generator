function virtualEncoder(posX, posY,p) {
    this.posX = posX;
    this.posY = posY;
    this.degrees = 0;

    this.rotate = function (val) {
        this.degrees = val;
        p.push();
        p.translate(this.posX, this.posY);
        p.rotate(this.degrees);
        p.noStroke();

        p.fill("#E7AD52");
        p.ellipse(0, 0, 60, 60);

        p.fill('#ce9540');
        p.ellipse(0, -16, 18, 18);

        p.pop();
    }
};