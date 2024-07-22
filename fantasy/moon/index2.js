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
const speed = 2 * Math.PI / 60 / 60 * 60 / 25 / 6;
let flag = true
let animationId

var draw_background = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bigX, bigX, radius, 0, Math.PI * 2);
    ctx.fill();
}
function draw_move_circle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_background()

    x = bigX + radius * Math.cos(angle);
    y = bigX + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    angle += speed;
    if (angle > 2 * Math.PI) {
        angle = 0;
    }
    animationId = requestAnimationFrame(draw_move_circle);
    // date_now.innerText += formatDateToAAA(new Date()) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + '    '
}

draw_move_circle();

setInterval(function () {
    // date_now.innerText += formatDateToISO8601(new Date()) + '   ' + x.toFixed(0) + '   ' + y.toFixed(0) + '\n'
}, 1000)

function formatDateToISO8601(date) {
    let pad = (num) => (`0${num}`).slice(-2); // 用于补零的函数  
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1); // 月份是从0开始的，所以需要加1  
    let day = pad(date.getDate());
    let hours = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function formatDateToAAA(date) {
    let pad = (num) => (`0${num}`).slice(-2); // 用于补零的函数  
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1); // 月份是从0开始的，所以需要加1  
    let day = pad(date.getDate());
    let hours = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());
    let ms = pad(date.getMilliseconds());
    return `${minutes}:${seconds}:${ms}`;
}