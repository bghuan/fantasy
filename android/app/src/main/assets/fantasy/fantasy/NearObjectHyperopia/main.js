// console.log(Math.sin(30 * Math.PI / 180))
// n1/n2=sina1/sina2
// 1/1.33=Math.sin(30 * Math.PI / 180)/Math.sin(x * Math.PI / 180)
// Math.sin(x * Math.PI / 180)=Math.sin(30 * Math.PI / 180)*1.33/1
// console.log(Math.sin(30 * Math.PI / 180) * 1.33 / 1) // 0.6649999999999999 0.665
// https://tool.520101.com/calculator/sanjiaohanshu/
// 41
const n1 = 1
// const n2 = 1.33
// 调试使用高对比度
const n2 = 2
const faster = (angle) => {
    let s = Math.sin(angle * Math.PI / 180) * n2 / n1
    return angle2 = Math.asin(s) * 180 / Math.PI
}
const slow = (angle) => {
    let s = Math.sin(angle * Math.PI / 180) * n1 / n2
    return angle2 = Math.asin(s) * 180 / Math.PI
}

let cl = console.log

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.equals = function (point) {
    return this.x == point.x && this.y == point.y
}
Point.prototype.isBlank = function () {
    return !this.x || !this.y
}

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
}
Circle.prototype.center = function () {
    return new Point(this.x, this.y)
}

// 已知起点终点求角度
function getAngle(start, end) {
    var diff_x = end.x - start.x,
        diff_y = end.y - start.y;
    return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
}

// 已知角度和直角边,求斜边c,对边a
function getAC(b, angle) {
    var radian = 2 * Math.PI / 360 * angle;
    return {
        c: b / Math.cos(radian),
        a: b * Math.tan(radian)
    }
}
// 斜率转角度
function angleBySlope(slope) {
    return 360 * Math.atan(slope) / (2 * Math.PI)
}

// 连线
function drwaLine(points, line) {
    line.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        line.lineTo(points[i].x, points[i].y)
        line.stroke()
    }
}

function nextPoint(pointA, pointB, length, flag = false, angle = 0) {
    let angle1 = getAngle(pointA, pointB) + angle // 以切线为y轴，得出假倾角
    let angle2 = flag ? faster(angle1) : slow(angle1)  // 得出折射角度
    angle2 = angle2 - angle // 恢复真实倾角
    let ac = getAC(length, angle2)
    return new Point(pointB.x + length, pointB.y + ac.a)
}

// 延长两点连线，待合并至nextPoint(无折射率)
function endPoint(pointA, pointB, length) {
    let angle1 = getAngle(pointA, pointB)
    let ac = getAC(length, angle1)
    return new Point(pointB.x + length, pointB.y + ac.a)
}

// 两点连线与圆相交点 https://blog.csdn.net/sinat_25911307/article/details/86598780
function getCirclePoint(pointA, pointB, circle) {
    let points = [new Point(), new Point()]
    k = (pointB.y - pointA.y) / (pointB.x - pointA.x);
    b = pointB.y - k * (pointB.x);
    del = 4 * Math.pow((k * b - circle.x - k * (circle.y)), 2) - 4 * (1 + k * k) * (Math.pow((circle.x), 2) + Math.pow((b - circle.y), 2) - circle.r * circle.r);
    if (del > 0) {
        tmp = 2 * (k * b - circle.x - k * circle.y);
        points[1].x = (-tmp + Math.sqrt(del)) / (2 * (1 + k * k));
        points[1].y = k * (points[1].x) + b;
        points[0].x = (-tmp - Math.sqrt(del)) / (2 * (1 + k * k));
        points[0].y = k * (points[0].x) + b;
    }
    return points
}

// 圆上某点的斜率倾角
function angleByCirclePoint(point, circle) {
    let k1 = (circle.y - point.y) / (point.x - circle.x)
    return angleBySlope(k1)
}

// 继承是否保留痕迹
let isClean = false
function clean() {
    if (isClean) return
    _clean()
}
document.body.addEventListener('keyup', (e) => isClean = (e.keyCode == 67 ? !isClean : isClean))
let down = false