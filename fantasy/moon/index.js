const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvas2 = document.createElement('canvas');
var ctx2 = canvas2.getContext('2d')
const canvas3 = document.getElementById('myCanvas2');
var ctx3 = canvas3.getContext('2d')

const diff = 60;
const radius = 60 * 3;
const radius2 = 60 * 3 + 30;
let writeXY = 180
let blackXY = 180
let x = y = 0;
let angle = Math.PI / 2;
let speed = 2 * Math.PI / 144 / 60 / 60;
// speed = 2 * Math.PI / 144 / 60 * 12;
let animationId
var dataPoints = []
var day = 'rgba(255, 255, 255, 0.9)'
var night = 'rgba(0, 0, 0, 1)'
let last_angle = 0
let show_other = false
let angle_diff = 0
let timeString = ''
ctx.globalCompositeOperation = show_other ? 'destination-over' : 'source-out'
let _2PI = 2 * Math.PI
let show_time = true
var angle_map = {}
let in_moon = false

function draw_move_circle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(x, y, radius2, 0, _2PI);
    ctx.fill();

    ctx.drawImage(canvas2, 0, 0, canvas.width, canvas.height)

    if (show_time && timeString != formatDateToHM(new Date()))
        drawTime();

    wangge()
    shizi()
    record()
    last_angle = angle
    // console.log(angle, angle - last_angle)
}
const path = new Path2D();
path.arc(writeXY, writeXY, radius, 0, _2PI);
function isMouseInMoon(e) {
    var in_a = ctx.isPointInPath(path, e.clientX, e.clientY, 'evenodd')
    if (!in_a) return false

    const path2 = new Path2D();
    path2.arc(x, y, radius2, 0, _2PI);

    var in_b = ctx.isPointInPath(path2, e.clientX, e.clientY, 'evenodd')
    return !in_b;
}

function move_circle() {
    angle += speed;
    if (angle > _2PI) angle = 0;
    if (angle == 0 || Math.abs(angle - last_angle) >= 0.001) {
        let _angle = angle.toFixed(2)
        if (Object.keys(angle_map).includes(_angle)) {
            x = angle_map[_angle][0]
            y = angle_map[_angle][1]
        }
        else {
            var _radius = radius + diff * timemap[msg3.value]
            x = blackXY + _radius * Math.cos(angle);
            y = blackXY + _radius * Math.sin(angle);
            angle_map[_angle] = [x, y]
        }
        draw_move_circle()
    }

    animationId = requestAnimationFrame(move_circle);
}

function drawCanvas2_refresh() {
    canvas2.width = canvas.width
    canvas2.height = canvas.height
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.beginPath();
    ctx2.fillStyle = get_fill(true);
    ctx2.arc(writeXY, writeXY, radius, 0, _2PI);
    ctx2.fill();

    ctx.fillStyle = get_fill(false);
    last_angle = 11
    timeString = "";

    angle_map = {}
}
function drawTime() {
    timeString = formatDateToHM(new Date());
    ctx3.clearRect(0, 0, canvas.width, canvas.height);
    ctx3.font = '30px Arial';
    ctx3.textAlign = 'center';
    ctx3.textBaseline = 'middle';
    ctx3.fillStyle = get_fill(true);
    ctx3.fillText(timeString, writeXY - 5, writeXY + 5);
}

function get_fill(flag) {
    const isDayTime = msg3.value >= 6 && msg3.value <= 18;
    return flag ? (isDayTime ? night : day) : (isDayTime ? day : night);
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
init_angle = (num) => {
    let minutes = new Date().getMinutes()
    if (num >= 0) minutes += num
    let time = minutes + new Date().getSeconds() / 60;
    angle = (time % 60) / 60 * _2PI;
}
change_angle = (num) => {
    angle_diff += num
    if (angle_diff > 60) angle_diff = 1
    if (angle_diff < 0) angle_diff = 59
    init_angle(angle_diff)
}
canvas.addEventListener('mousemove', (e) => {
    if (isMouseInMoon(e)) {
        canvas.style.cursor = 'pointer';
    } else {
        sendWinform('blur');
        canvas.style.cursor = 'default';
    }
    // if (!in_moon && _in_moon) {
    //     canvas.style.cursor = 'pointer';
    // } else if (in_moon && !_in_moon) {
    //     sendWinform('blur');
    //     canvas.style.cursor = 'default';
    // }
});
putFile = (e, a, s, d, f, g) => {
    debugger
}
document.ondragover = () => false
document.ondrop = putFile

document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowDown') msg3.value = Number(msg3.value) - 1
    if (e.key == 'ArrowUp') msg3.value = Number(msg3.value) + 1
    if (e.key == 'ArrowRight') change_angle(1)
    if (e.key == 'ArrowLeft') change_angle(-1)
    if (e.key == 'Enter') init_angle()
    if (e.key == 'f') sendWinform('blur')
    if (e.key == 'Escape') {
        show_other = !show_other;
        ctx.globalCompositeOperation = show_other ? 'destination-over' : 'source-out'
    }
    if (e.key == 'a') document.body.style.backgroundColor = document.body.style.backgroundColor == 'black' ? 'white' : 'black'
    if (e.key == 's') saveLocation()
    if (e.key == 'd') {
        show_time = !show_time
        if (!show_time)
            ctx3.clearRect(0, 0, canvas.width, canvas.height);
    }
    msg3.onchange = () => {
        if (msg3.value < 0) msg3.value = 23;
        if (msg3.value > 24) msg3.value = 1
        drawCanvas2_refresh()
    }
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
// scroll(180, 180)
init_angle()
drawCanvas2_refresh()

move_circle()