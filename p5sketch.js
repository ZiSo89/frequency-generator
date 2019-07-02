
//  bots-go -d C:\Project\p5\p5bots\revealP5bots
//  bots-go -d /home/pi/project/
//  localhost:8000

/*

    Oscillator Frequency

 */

var sketch = function (p) {

  var canvasHeight = 550;
  var canvasWidth = 360;

  var osc, fft;

  // Board setup — you may need to change the port
  var b = p5.board('/dev/ttyACM0', 'arduino'); // /dev/ttyACM0

  // encoder
  var enc = new encoder(2, 3, b);
  var encV = new virtualEncoder(canvasHeight / 2, canvasWidth - 80, p);

  var resolution = 20; //Cycles Per Revolution
  var encPosLast = 0;
  var encStepDegr = 0;
  var encStepFreq = 0;

  // analog read
  var a0 = new analog(0, b);
  var V5 = b.pin(4, 'DIGITAL', 'PULLUP');
  var smoothValue = 0.2;
  var volume = 0.0;
  var volumeLast = 0.0;
  var anaval = 0.0;

  p.setup = function () {
    var myCanvas = p.createCanvas(canvasHeight, canvasWidth)
    p.angleMode(p.DEGREES);
    initOsc();
  }

  p.draw = function () {
    p.noCursor();
    p.background("#111111"); // "#111111"
    //p.fill("#E7AD52")
    //p.ellipse(p.mouseX, p.mouseY, 20, 20)

    var encPos = enc.getPos();
    if (encPosLast != encPos) {

      encStepDegr += encPos;
      if (encStepDegr > resolution)
        encStepDegr = 0;
      else if (encStepDegr < 0)
        encStepDegr = resolution;

      encStepFreq += encPos;
      if (encStepFreq > 400)
        encStepFreq = 400;
      else if (encStepFreq < 0)
        encStepFreq = 0;
      //console.log(" Freq  " + encStepFreq + "Hz");

      enc.setPos(0);
      encPosLast = encPos;
    }
    var degrees = p.map(encStepDegr, 0, resolution, 0, 359);
    encV.rotate(degrees);

    // volume
    if (a0.overThreshold() == true) {
      anaval = a0.getVal();
      var min = 5;
      var max = 225;

      if (anaval > max)
        anaval = max;
      if (anaval < min)
        anaval = min;
      anaval = p.map(anaval, min, max, 0, 100);
    }

    volume = p.lerp(volume, anaval, smoothValue);
    if (volumeLast != p.round(volume)) {
      volumeLast = p.round(volume);
      //console.log(p.round(volume));
    }

    writeFreq(encStepFreq, canvasHeight / 2, canvasWidth - 125);

    drawWaveForm();

    osc.freq(encStepFreq);
    osc.amp(p.map(volume, 100, 0, 1, .01));
  }

  function drawWaveForm() {
    var waveform = fft.waveform();  // analyze the waveform
    p.stroke(100);
    p.strokeWeight(7);
    p.beginShape();
    p.noFill();
    for (var i = 0; i < waveform.length; i++) {
      var x = p.map(i, 0, waveform.length, 0, canvasHeight);
      var y = p.map(waveform[i], -1, 1, canvasWidth / 2, 0);
      p.vertex(x, y);
    }
    p.endShape();
    p.strokeWeight(1);
  }

  function initOsc() {
    //osc = new p5.TriOsc();
    osc = new p5.SinOsc(); // set frequency and type
    osc.amp(0);
    fft = new p5.FFT();
    osc.start();
  }

  function writeFreq(text, posx, posy) {
    p.stroke(1);
    p.textSize(30);
    p.textAlign(p.CENTER);
    p.textFont('Digital-7');
    p.fill(200); //#8F0C12
    var str = "" + text;
    var pad = "000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    p.text("" + ans, posx, posy);
    p.textSize(15);
    p.textFont('Calibri');
    p.text("Hz", posx + 30, posy);
  }

}

var p5js = new p5(sketch, 'p5sketch')