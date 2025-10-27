let mic;
let vol = 0;
let co2 = 600;
let co2Trend = 1;
let co2Speed = 0.5;
let alarmTekst = "";
let alarmTimer = 0;
let alarmSpillet = false;
let knap;
let aktiv = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  noStroke();

  mic = new p5.AudioIn();

  knap = createButton("🎤 Start lydmåling");
  designKnap("#4CAF50");
  knap.position(width / 4.5 - 250, height - 210);
  knap.mousePressed(toggleMic);
}

function designKnap(farve) {
  knap.style("font-size", "60px");
  knap.style("font-family", "Arial, sans-serif");
  knap.style("font-weight", "bold");
  knap.style("border", "none");
  knap.style("border-radius", "25px");
  knap.style("padding", "20px 40px");
  knap.style("background", farve);
  knap.style("color", "white");
  knap.style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)");
  knap.style("transition", "0.3s");
}

function toggleMic() {
  getAudioContext().resume();
  if (!aktiv) {
    mic.start();
    aktiv = true;
    knap.html("⏹️ Stop lydmåling");
    designKnap("#F44336");
  } else {
    mic.stop();
    aktiv = false;
    knap.html("🎤 Start lydmåling");
    designKnap("#4CAF50");
  }
}

function draw() {
  background(20);
  let mid = width / 2;

  if (aktiv) vol = mic.getLevel();
  let dB = map(vol, 0, 0.2, 30, 100);
  dB = constrain(dB, 30, 100);

  co2 += random(-co2Speed, co2Speed) * co2Trend;
  if (frameCount % 200 === 0) {
    co2Trend = random([-1, 1]);
    co2Speed = random(0.3, 1.2);
  }
  co2 = constrain(co2, 400, 1600);

  let colorState;
  if (co2 < 800) colorState = "#4CAF50";
  else if (co2 < 1200) colorState = "#FFEB3B";
  else colorState = "#F44336";

  if (dB > 85 && aktiv) {
    if (!alarmSpillet) {
      alarmLyd();
      alarmSpillet = true;
    }
    alarmTekst = "🔴 Lyden er for høj! 🙉";
    alarmTimer = millis();
  } else {
    alarmSpillet = false;
  }

  // dB-måler
  push();
  translate(mid / 2, height / 2 + 100);
  strokeWeight(25);
  noFill();
  stroke(80);
  arc(0, 0, height * 0.6, height * 0.6, -180, 0);

  let arcColor = "#4CAF50";
  if (dB > 70 && dB <= 85) arcColor = "#FFEB3B";
  if (dB > 85) arcColor = "#F44336";
  stroke(arcColor);
  let angle = map(dB, 30, 100, -180, 0, true);
  arc(0, 0, height * 0.6, height * 0.6, -180, angle);

  noStroke();
  fill(255);
  textSize(32);
  text("dB", 0, -40);
  textSize(26);
  text(int(dB) + " dB", 0, 10);
  textSize(18);
  text("-", -height * 0.30, 60);
  text("+", height * 0.30, 60);

  if (millis() - alarmTimer < 2000) {
    fill(255, 0, 0);
    textSize(22);
    text(alarmTekst, 0, -100);
  }
  pop();

  // smiley og CO2
  let smileX = mid + mid / 2;
  let smileY = height / 2 - 30;

  noStroke();
  fill(colorState);
  circle(smileX, smileY, height * 0.4);

  fill(0);
  circle(smileX - 40, smileY - 40, 25);
  circle(smileX + 40, smileY - 40, 25);
  noFill();
  stroke(0);
  strokeWeight(7);
  arc(smileX, smileY, 120, 80, 20, 160);

  noStroke();
  fill(colorState);
  rect(mid + 30, smileY + height * 0.28, mid - 60, height * 0.142, 20);

  fill("white");
  textSize(60);
  textStyle(BOLD);
  text(int(co2) + " ppm", smileX, smileY + height * 0.35);
}

function alarmLyd() {
  let osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(880);
  osc.amp(0.2);
  osc.start();
  setTimeout(() => osc.stop(), 200);
}

function touchStarted() {
  getAudioContext().resume();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
