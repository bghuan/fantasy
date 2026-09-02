const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvas2 = document.createElement('canvas');
var ctx2 = canvas2.getContext('2d')
const canvas3 = document.getElementById('myCanvas2');
var ctx3 = canvas3.getContext('2d')

// let size = 1 // 3
let size = 1
let diff = 60;
let radius = 60 * 3;
let radius2 = 60 * 3 + 30;
let writeXY = 180
let blackXY = 180
let x = y = 0;
let angle = Math.PI / 2;
let speed = 2 * Math.PI / 144 / 60 / 60;
speed = 2 * Math.PI / 144 / 60 * 12;
let animationId
var dataPoints = []
var day = 'rgba(255, 255, 255, 1)'
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
let path = new Path2D();
function isMouseInMoon(e) {
    var in_a = ctx.isPointInPath(path, e.clientX, e.clientY, 'evenodd')
    // console.log(in_a, e.clientX, e.clientY, writeXY, radius)
    if (!in_a) return false

    let path2 = new Path2D();
    path2.arc(x, y, radius2, 0, _2PI);

    var in_b = ctx.isPointInPath(path2, e.clientX, e.clientY, 'evenodd')
    return !in_b;
}
function roundTo2point5(num) {
    let n = Math.floor(num * 1000); // 保留两位
    let third = Math.floor(num * 1000) % 10; // 第三位
    if (third < 5) {
        return ((n - third) / 1000).toFixed(3);
    } else {
        return ((n - third + 5) / 1000).toFixed(3); // 第三位为5
    }
}
function round(num) {
    let n = Math.floor(num * 1000);
    // let third = n % 2;
    // switch (third) {
    //     case 0: return (n / 1000).toFixed(3);
    //     case 1: return ((n + 1) / 1000).toFixed(3);
    // } 
    let third = n % 10;
    if (third < 3) {
        return ((n - third) / 1000).toFixed(3); // 第三位为0
    }
    if (third < 6) {
        return ((n - third + 3) / 1000).toFixed(3); // 第三位为0
    }
    if (third <= 9) {
        return ((n - third + 6) / 1000).toFixed(3); // 第三位为0
    }
}
function move_circle() {
    // angle += speed;
    let time = new Date().getMinutes();
    angle = (time % 60) / 60 * _2PI;

    if (angle > _2PI) angle = 0;
    if (angle == 0 || Math.abs(angle - last_angle) >= 0.001) {
        let flag = true
        let _angle = round(angle)//angle.toFixed(3)
        if (Object.keys(angle_map).includes(_angle)) {
            if (angle_map[_angle][0] == x && angle_map[_angle][1] == y)
                flag = false
            x = angle_map[_angle][0]
            y = angle_map[_angle][1]
        }
        else {
            var _radius = radius + diff * timemap[msg3.value]
            x = blackXY + _radius * Math.cos(angle);
            y = blackXY + _radius * Math.sin(angle);
            angle_map[_angle] = [x, y]
        }
        if (flag)
            draw_move_circle()
    }

    // animationId = requestAnimationFrame(move_circle);
}

function drawCanvas2_refresh() {
    canvas2.width = canvas.width
    canvas2.height = canvas.height
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.beginPath();
    ctx2.fillStyle = get_fill2(true).replace('1', '0.8');
    ctx2.arc(writeXY, writeXY, radius, 0, _2PI);
    ctx2.fill();

    ctx.fillStyle = get_fill2(false).replace('0.8', '1');;
    last_angle = 11
    timeString = "";

    angle_map = {}
}
function drawTime() {
    const timeNow = new Date();
    const timeString = formatDateToHM(timeNow); // 时间格式化函数（原逻辑保留）
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    ctx3.clearRect(0, 0, canvasWidth, canvasHeight);

    const bigFontSize = 39 * size + 5; // 大字（时间）字号
    ctx3.font = `${bigFontSize}px Arial`;
    ctx3.textAlign = 'center'; // 水平居中
    ctx3.textBaseline = 'middle'; // 垂直居中（以 y 坐标为中心）
    ctx3.fillStyle = get_fill2(true).replace('0.8', '1'); // 原颜色逻辑保留

    const bigTextX = writeXY - 2; // 原水平位置保留
    const bigTextY = writeXY + 2; // 大字的垂直中心位置
    ctx3.fillText(timeString, bigTextX, bigTextY); // 绘制时间

    const dateString = formatDateToDay(timeNow); // 日期格式化函数（原逻辑保留）
    // let smallFontSize = 8 * size; // 小字（日期）字号（原逻辑保留，约 11px）
    // if (smallFontSize < 3) return   
    let smallFontSize = 22 * size; // 小字（日期）字号（原逻辑保留，约 11px）

    ctx3.font = `${smallFontSize}px Arial`;
    ctx3.textAlign = 'center'; // 水平居中（与大字保持一致，确保左右对齐）
    ctx3.textBaseline = 'top'; // 关键：小字的“顶部”对齐到偏移后的 y 坐标
    ctx3.fillStyle = get_fill2(true).replace('0.8', '1'); // 原颜色逻辑保留

    const spacing = -4; // 大字与小字之间的间距（可根据需求修改，如 3px/6px）
    // const smallTextX = bigTextX + 32; // 水平位置与大字完全一致（确保左右对齐）
    const smallTextX = bigTextX + 5; // 水平位置与大字完全一致（确保左右对齐）
    const smallTextY = bigTextY + (bigFontSize / 2) + spacing;

    ctx3.fillText(dateString, smallTextX, smallTextY);
}

function get_fill(flag) {
    const isDayTime = msg3.value >= 6 && msg3.value <= 18;
    return flag ? (isDayTime ? night : day) : (isDayTime ? day : night);
}
// let get_fill2_flag = 1;
function get_fill2(flag) {
    return ((localStorage.get_fill2_flag == 'true' ? false : true) ^ flag ? night : day);
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
    diff = diff * size;
    radius = radius * size;
    radius2 = radius2 * size;
    writeXY = writeXY * size;
    blackXY = blackXY * size;
    path.arc(writeXY, writeXY, radius, 0, _2PI);

    let minutes = new Date().getMinutes()
    if (num >= 0) minutes += num
    let time = minutes + new Date().getSeconds() / 60;
    angle = (time % 60) / 60 * _2PI;

    if (localStorage.get_fill2_flag != 'true' && localStorage.get_fill2_flag != 'false') localStorage.get_fill2_flag = true
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
});
putFile = (e, a, s, d, f, g) => {
    debugger
}
document.ondragover = () => false
document.ondrop = putFile

document.addEventListener('keydown', (e) => {
    // if (e.key == 'ArrowDown') msg3.value = Number(msg3.value) - 1
    // if (e.key == 'ArrowUp') msg3.value = Number(msg3.value) + 1
    // if (e.key == 'ArrowRight') change_angle(1)
    // if (e.key == 'ArrowLeft') change_angle(-1)
    if (e.key == 'Enter') init_angle()
    // if (e.key == 'Escape') {
    //     show_other = !show_other;
    //     ctx.globalCompositeOperation = show_other ? 'destination-over' : 'source-out'
    // }
    // if (e.key == 'a') document.body.style.backgroundColor = document.body.style.backgroundColor == 'black' ? 'white' : 'black'
    if (e.key == 's') saveLocation()
    if (e.key == 'd') {
        show_time = !show_time
        if (!show_time) ctx3.clearRect(0, 0, canvas.width, canvas.height);
        else drawTime()
    }
    // if (e.key == 'f') sendWinform('blur')
    if (e.key == 'g') {
        localStorage.get_fill2_flag = localStorage.get_fill2_flag == 'true' ? 'false' : 'true';
        drawCanvas2_refresh(); move_circle();
    }
    // msg3.onchange = () => {
    //     if (msg3.value < 0) msg3.value = 23;
    //     if (msg3.value > 24) msg3.value = 1
    //     drawCanvas2_refresh()
    // }
    // msg3.onchange()
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
setInterval(move_circle, 60000);

function small_size() {
    size = 1 / 3
    init_angle()
    drawCanvas2_refresh();
    move_circle();
}