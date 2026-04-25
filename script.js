const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

// AUDIO
const audio = document.getElementById("audio");
const startBtn = document.getElementById("startBtn");

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

let data = new Uint8Array(analyser.frequencyBinCount);
let source;

// IMPORTANT: your song file
audio.src = "song.mp3";

// start button
startBtn.addEventListener("click", async () => {
  await audio.play();
  await audioCtx.resume();

  if (!source) {
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  startBtn.style.display = "none";
});

// particles
let particles = [];
for (let i = 0; i < 1000; i++) {
  particles.push({
    x: (Math.random() - 0.5) * 800,
    y: (Math.random() - 0.5) * 800,
    z: Math.random() * 1500
  });
}

function drawHeart(x, y, size) {
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 2; t += 0.03) {
    let hx = 16 * Math.pow(Math.sin(t), 3);
    let hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    ctx.lineTo(x + hx * size, y - hy * size);
  }
  ctx.closePath();
  ctx.fill();
}

// mouse
let mouse = { x: 0, y: 0 };
addEventListener("mousemove", e => {
  mouse.x = (e.clientX - innerWidth/2) * 0.003;
  mouse.y = (e.clientY - innerHeight/2) * 0.003;
});

// animation
let energySmooth = 0;

function loop() {
  requestAnimationFrame(loop);

  analyser.getByteFrequencyData(data);

  let energy = data.reduce((a,b)=>a+b,0) / data.length / 255;
  energySmooth += (energy - energySmooth) * 0.1;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for (let p of particles) {
    p.z -= 5 + energySmooth * 8;

    if (p.z <= 1) {
      p.z = 1500;
      p.x = (Math.random() - 0.5) * 800;
      p.y = (Math.random() - 0.5) * 800;
    }

    let scale = 600 / p.z;

    let x = cx + (p.x + mouse.x * p.z) * scale;
    let y = cy + (p.y + mouse.y * p.z) * scale;

    ctx.beginPath();
    ctx.arc(x,y,2,0,Math.PI*2);
    ctx.fillStyle = "hotpink";
    ctx.fill();
  }

  let pulse = 10 + energySmooth * 8;

  ctx.fillStyle = "rgba(200,60,140,0.7)";
  ctx.shadowColor = "hotpink";
  ctx.shadowBlur = 40;

  drawHeart(cx, cy, pulse);
}

loop();
