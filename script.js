window.onload = () => {

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// UI
const btn = document.getElementById("startBtn");
const message = document.getElementById("message");

// particles
let particles = [];

for (let i = 0; i < 500; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2
  });
}

// animation loop
function draw() {
  requestAnimationFrame(draw);

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "hotpink";
    ctx.fill();

    p.y += 0.5;
    if (p.y > canvas.height) p.y = 0;
  }
}

draw();

// click event
btn.addEventListener("click", () => {
  btn.style.display = "none";
  message.classList.add("show");
});

};
