const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const radius = 207;
let diff = 150
let bigX = 500
let bigX2 = 600
let x = radius;
let y = radius;
let dx = 1;
let dy = 1;
let angle = 0;
const speed = 0.01;
let flag = true
let animationId

var asd = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bigX, bigX, radius, 0, Math.PI * 2);
    ctx.fill();
}
function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asd()

    x = bigX + radius * Math.cos(angle);
    y = bigX + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(x, y, radius + 70, 0, 2 * Math.PI);
    ctx.fill();
    angle += speed;
    if (angle > 2 * Math.PI) {
        angle = 0;
    }
    animationId = requestAnimationFrame(drawCircle);
}

drawCircle();

document.addEventListener("mousedown", handleMousedown, false)
document.addEventListener("mousemove", handleMousemove, false)
function handleMousedown(event) {
    flag = !flag
    canvas.style.cursor = canvas.style.cursor === 'none' ? 'auto' : 'none';
    if (!flag) {
        cancelAnimationFrame(animationId)
    } else {
        drawCircle()
    }
}
function handleMousemove(event) {
    if (flag) return
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asd()
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(event.clientX, event.clientY, radius, 0, 2 * Math.PI);
    ctx.fill();
}