document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('myCanvas');
    var canvas2 = document.getElementById('myCanvas2');
    var ctx = canvas.getContext('2d');
    var ctx2 = canvas2.getContext('2d');

    var isDrawing = false;
    var lastX = 0;
    var lastY = 0;

    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', function (e) {
        lastX = e.offsetX;
        lastY = e.offsetY;
        isDrawing = true;
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        beginX = e.offsetX;
        beginY = e.offsetY;
    });
    canvas2.addEventListener('mousedown', function (e) {
        canvas2.style.cursor = canvas.style.cursor === 'none' ? 'auto' : 'none';
    });

    beginX = 0;
    beginY = 0;
    //需适应用户鼠标可拉取范围,截取用户想触发的鼠标移动单位
    canvas.addEventListener('mousemove', function (e) {
        if (!isDrawing) return;

        var currentX = e.offsetX;
        var currentY = e.offsetY;

        drawLine(lastX, lastY, currentX, currentY);

        lastX = currentX;
        lastY = currentY;
        judgeArrow()
        // throttle(judgeArrow, 500)()
    });
    canvas2.addEventListener('mousemove', function (e) {
        lastX = Math.floor(e.offsetX / gridSize) * gridSize
        lastY = Math.floor(e.offsetY / gridSize) * gridSize
        if (lastX == lastPoint[0] && lastY == lastPoint[1]) return
        lastPoint = [lastX, lastY]
        arrow()
    });
    var throttle = function (func, delay) {
        var timer = null;
        var startTime = Date.now();
        return function () {
            // scroll_bottom()
            var curTime = Date.now();
            var remaining = delay - (curTime - startTime);
            var context = this;
            var args = arguments;
            clearTimeout(timer);
            if (remaining <= 0) {
                func.apply(context, args);
                startTime = Date.now();
            } else {
                timer = setTimeout(func, remaining);
            }
        }
    }
    canvas.addEventListener('mouseup', function () {
        isDrawing = false;

    });

    judgeArrow = () => {
        a = lastY - beginY
        b = lastX - beginX
        if (a > 0 && Math.abs(a) > Math.abs(b)) {
            lastPoint = [beginPoint[0], beginPoint[1] + gridSize]
        }
        else if (a < 0 && Math.abs(a) > Math.abs(b)) {
            lastPoint = [beginPoint[0], beginPoint[1] - gridSize]
        }
        else if (b > 0 && Math.abs(a) < Math.abs(b)) {
            lastPoint = [beginPoint[0] + gridSize, beginPoint[1]]
        }
        else if (b < 0 && Math.abs(a) < Math.abs(b)) {
            lastPoint = [beginPoint[0] - gridSize, beginPoint[1]]
        }
        arrow()
    }
    beginPoint = [0, 0]
    lastPoint = [0, 0]
    arrow = () => {
        if (lastPoint[0] < 0) lastPoint[0] = 0
        if (lastPoint[1] < 0) lastPoint[1] = 0
        if (lastPoint[0] >= canvas2.width) lastPoint[0] = canvas2.width - gridSize
        if (lastPoint[1] >= canvas2.height) lastPoint[1] = canvas2.height - gridSize
        drawGrid()
        ctx2.fillRect(lastPoint[0], lastPoint[1], gridSize, gridSize); // 绘制正方形，参数分别是x, y, 宽度, 高度 
        beginPoint = lastPoint
    }

    canvas.addEventListener('mouseout', function () {
        isDrawing = false;
    });

    var gridSize = 100; // 网格的大小（每格的宽高）  
    drawGrid = () => {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        for (var x = 0; x <= canvas2.width; x += gridSize) {
            ctx2.beginPath();
            ctx2.moveTo(x, 0);
            ctx2.lineTo(x, canvas2.height);
            ctx2.strokeStyle = '#ccc'; // 保持与水平网格线相同的颜色  
            ctx2.stroke();
        }
        for (var x = 0; x <= canvas2.height; x += gridSize) {
            ctx2.beginPath();
            ctx2.moveTo(0, x);
            ctx2.lineTo(canvas2.height, x);
            ctx2.strokeStyle = '#ccc'; // 保持与水平网格线相同的颜色  
            ctx2.stroke();
        }
    }
    drawGrid()
});