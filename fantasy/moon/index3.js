const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let RRR = 200;
let XXX = 500;

function findCircleCenter(x1, y1, x2, y2, radius) {
    const d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    if (d > 2 * radius) {
        return null;
    }
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const h = Math.sqrt(radius * radius - (d / 2) * (d / 2));
    const dx = (x2 - x1) / d;
    const dy = (y2 - y1) / d;
    let point = [
        midX + h * dy,
        midY - h * dx,
        midX - h * dy,
        midY + h * dx
    ];
    if ((499 < point[0] && point[0] < 501) && (499 < point[1] && point[1] < 501)) return [point[2], point[3]];
    else if ((499 < point[2] && point[2] < 501) && (499 < point[3] && point[3] < 501)) return [point[0], point[1]];
}
let gudi = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(XXX, XXX, RRR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}
function updateCircles() {
    gudi()
    dedu()

    let hhhValue = parseInt(document.getElementById('HHH').value);
    const mmmValue = parseInt(document.getElementById('MMM').value);
    if (hhhValue >= 12) {
        document.getElementById('HHH').value = 0;
    }
    if (mmmValue >= 60) {
        document.getElementById('HHH').value = hhhValue + 1;
        hhhValue += 1;
        document.getElementById('MMM').value = 0;
    }

    const hhhAngleInRadians = ((hhhValue % 12) * 30 + 0 / 2) * (Math.PI / 180);
    const hhhX = XXX + RRR * Math.sin(hhhAngleInRadians);
    const hhhY = XXX - RRR * Math.cos(hhhAngleInRadians);

    const mmmAngleInRadians = (mmmValue * 6) * (Math.PI / 180);
    const mmmX = XXX + RRR * Math.sin(mmmAngleInRadians);
    const mmmY = XXX - RRR * Math.cos(mmmAngleInRadians);

    let centers = findCircleCenter(hhhX, hhhY, mmmX, mmmY, RRR);
    if (centers) {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(centers[0], centers[1], RRR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    if (!flag2) return
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(hhhX, hhhY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(mmmX, mmmY, 5, 0, Math.PI * 2);
    ctx.fill();
}
let dedu = () => {
    if (!flag2) return
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        const x = XXX + RRR * Math.sin(angle);
        const y = XXX - RRR * Math.cos(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    for (let i = 0; i < 60; i++) {
        const angle = (i * 6) * (Math.PI / 180);
        const x = XXX + RRR * Math.sin(angle);
        const y = XXX - RRR * Math.cos(angle);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'gray';
        ctx.fill();
    }
}

document.getElementById('HHH').addEventListener('input', updateCircles);
document.getElementById('MMM').addEventListener('input', updateCircles);

let animationId;
function drawCircle() {
    let interval = parseInt(document.getElementById('III').value); // 设置时间间隔为 1 秒
    const mmmValue = parseInt(document.getElementById('MMM').value);
    document.getElementById('MMM').value = mmmValue + 1;
    updateCircles();
    animationId = setTimeout(drawCircle, interval);
}


let flag = true
let flag2 = true
document.addEventListener("mousedown", handleMousedown, false)
document.addEventListener("mousemove", handleMousemove, false)
function handleMousedown(event) {
    flag = !flag
    flag2 = false
    canvas.style.cursor = canvas.style.cursor === 'none' ? 'auto' : 'none';
    if (!flag) {
        clearInterval(animationId)
    } else {
        drawCircle()
    }
}
function handleMousemove(event) {
    if (flag) return
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gudi()
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(event.clientX, event.clientY, RRR, 0, 2 * Math.PI);
    ctx.fill();
}


document.getElementById('HHH').value = new Date().getHours()
document.getElementById('MMM').value = new Date().getMinutes()
drawCircle();