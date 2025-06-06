const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const diff = 60;
const radius = 60 * 3;
const radius2 = 60 * 3 + 30;
let writeXY = 360
let blackXY = 360
let x = y = 0;
let angle = Math.PI / 2;
let speed = 2 * Math.PI / 144 / 60 / 60;
// speed = 2 * Math.PI / 144 / 60 * 2;
let animationId
var dataPoints = []
var day = 'rgba(255, 255, 255, 0.9)'
var night = 'rgba(0, 0, 0, 1)'
let last_angle = 0
let show_other = false
let angle_diff = 0
let lastFrameTime = 0;
const targetFPS = 160;
const frameInterval = 1000 / targetFPS;

function draw_move_circle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = get_fill(false);
    ctx.arc(x, y, radius2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation = show_other ? 'destination-over' : 'source-out'

    ctx.beginPath();
    ctx.fillStyle = get_fill(true);
    ctx.arc(writeXY, writeXY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = show_other ? 'destination-over' : 'source-over'

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let timeString = formatDateToHM(new Date());
    ctx.fillStyle = get_fill(true);
    ctx.fillText(timeString, writeXY - 5, writeXY + 5);

    wangge()
    shizi()
    record()
    last_angle = angle
    // console.log(angle, angle - last_angle)
}
function move_circle(timestamp) {
    angle += speed;
    if (angle > 2 * Math.PI) angle = 0;
    if (angle == 0 || Math.abs(angle - last_angle) >= 0.001) {
        if (!lastFrameTime || timestamp - lastFrameTime > frameInterval) {
            lastFrameTime += frameInterval;
            var _radius = radius + diff * timemap[msg3.value]
            x = blackXY + _radius * Math.cos(angle);
            y = blackXY + _radius * Math.sin(angle);

            draw_move_circle()
        }
    }

    animationId = requestAnimationFrame(move_circle);
}

function get_fill(flag) {
    const isDayTime = msg3.value >= 6 && msg3.value <= 18;
    return flag ? (isDayTime ? night : day) : (isDayTime ? day : night);
}
function border() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    ctx.stroke();
}
function record() {
    pointX = x.toFixed(0)
    pointY = y.toFixed(0)
    const isDuplicate = dataPoints.some(point =>
        point[0] === formatDateToMS(new Date()) &&
        point[1] === pointX &&
        point[2] === pointY
    );

    msg.innerText = formatDateToMSM(new Date()) + ' ' + pointX + ' ' + pointY
    if (isDuplicate) return
    if ((pointX) % 60 == 0 && (pointY) % 60 == 0)
        msg2.innerHTML += formatDateToMSM(new Date()) + ' ' + x + ' ' + y + '</br>'
    dataPoints.push([formatDateToMS(new Date()), pointX, pointY])
}
init_angle = () => {
    let aaa = new Date().getMinutes() + (new Date().getSeconds()) / 60
    angle = (aaa / 30 * Math.PI)
    if (aaa > 45) angle = ((aaa - 45) / 30 * Math.PI - Math.PI / 2)
    // angle = (aaa / 30 * Math.PI) + Math.PI / 2
    // if (aaa > 45) angle = ((aaa - 45) / 30 * Math.PI)
}
change_angle = (num) => {
    angle_diff += num
    if (angle_diff > 60) angle_diff = 1
    if (angle_diff < 0) angle_diff = 59
    let aaa = new Date().getMinutes() + (new Date().getSeconds()) / 60 + angle_diff
    angle = (aaa / 30 * Math.PI) + Math.PI / 2
    if (aaa > 45) angle = ((aaa - 45) / 30 * Math.PI)
}
document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowDown') msg3.value = Number(msg3.value) - 1
    if (e.key == 'ArrowUp') msg3.value = Number(msg3.value) + 1
    if (e.key == 'ArrowRight') change_angle(1)
    if (e.key == 'ArrowLeft') change_angle(-1)
    if (e.key == 'Enter') init_angle()
    if (e.key == 'Escape') show_other = !show_other
    if (e.key == 'b') document.body.style.backgroundColor = document.body.style.backgroundColor == 'black' ? 'white' : 'black'
    if (e.key == 'c') saveLocation()
    msg3.onchange()
});
if (window.outerWidth < 800) {
    document.querySelector('.info-container').style.display = 'none'
    record = () => { }
}
else {
    msg3.value = 14
}
// msg3.focus()
scroll(180, 180)
init_angle()
move_circle();
