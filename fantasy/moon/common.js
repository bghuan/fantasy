
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
function formatDateToMSM(date) {
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
function formatDateToMS(date) {
    let pad = (num) => (`0${num}`).slice(-2); // 用于补零的函数  
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1); // 月份是从0开始的，所以需要加1  
    let day = pad(date.getDate());
    let hours = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());
    let ms = pad(date.getMilliseconds());
    return `${minutes}:${seconds}`;
}
function formatDateToHM(date) {
    let pad = (num) => (`0${num}`).slice(-2); // 用于补零的函数  
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1); // 月份是从0开始的，所以需要加1  
    let day = pad(date.getDate());
    let hours = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());
    let ms = pad(date.getMilliseconds());
    return `${hours}:${minutes}`;
}
var timemap = {
    "0": -3,
    "1": -2,
    "2": -1,
    "3": 0,
    "4": 1,
    "5": 2,
    "6": 3,
    "7": 2,
    "8": 1,
    "9": 0,
    "10": -1,
    "11": -2,
    "12": -3,
    "13": -2,
    "14": -1,
    "15": 0,
    "16": 1,
    "17": 2,
    "18": 3,
    "19": 2,
    "20": 1,
    "21": 0,
    "22": -1,
    "23": -2,
    "24": -3,
}
msg3.onchange = () => {
    if (msg3.value < 0) msg3.value = 23;
    if (msg3.value > 24) msg3.value = 1
}
function shizi() {
    if (!show_other) return
    ctx.beginPath();
    ctx.moveTo(x - 180, y);
    ctx.lineTo(x + 180, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - 180);
    ctx.lineTo(x, y + 180);
    ctx.stroke();
}

function wangge() {
    if (!show_other) return
    ctx.strokeStyle = 'rgba(86, 109, 223, 0.3)'; // 半透明白色
    ctx.lineWidth = 1;

    // 绘制垂直线
    for (let x = 0; x <= canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y <= canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}