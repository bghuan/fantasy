let pixi_canvas = document.getElementById('pixi_canvas');
let color_bg = 0x1099bb;
let color_inline = 0xffd900;
let color_line = 0x3A5FCD;
let color1 = 0x0d90b0;
let _width = (window.innerWidth >= (window.innerHeight / 2) ? window.innerHeight / 2 : window.innerWidth);
let is_mousedown = 0;
let option = { backgroundColor: color_bg, transparent: true, antialias: true, resolution: 1, view: pixi_canvas }
let circle1 = { x: _width / 2, y: _width / 2, r: _width * 18 / 24 / 2 }
let circle2 = { x: _width / 2, y: _width / 2, r: _width * 18 / 24 / 2 - 30 }
let rectangle1 = { x: _width / 6, y: _width / 6 + _width, width: _width * 4 / 6, height: _width * 4 / 6 }
let rectangle2 = { x: _width / 6 + 30, y: _width / 6 + _width + 30, width: _width * 4 / 6 - 60, height: _width * 4 / 6 - 60 }
let ongoingTouches = new Array();
let mouse_x;
let mouse_y;
let graphics;
let graphics_bg;
let graphics_line;
let stripe;
let refresh;
let max = 1;
let min = -1;
let plus_minus = 1;

let app = new PIXI.Application(window.innerWidth, window.innerHeight - 4, option);
let stage = new PIXI.Container();
app.stage.interactive = true;

PIXI.loader
    .add("static/image/stripe.jpg")
    .add("static/svg/refresh-cw-write.svg")
    .load(setup);
function setup() {
    graphics = new PIXI.Graphics();
    graphics_bg = new PIXI.Graphics();
    graphics_line = new PIXI.Graphics();
    graphics.lineStyle(0);
    graphics.drawCircle2 = function (circle) { graphics.drawCircle(circle.x, circle.y, circle.r); }
    graphics.drawRect2 = function (rectangle) { graphics.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height); }

    graphics.beginFill(color_inline);
    graphics.drawCircle2(circle1);
    graphics.drawRect2(rectangle1);
    graphics.beginFill(color_bg);
    graphics.drawCircle2(circle2);
    graphics.drawRect2(rectangle2);
    graphics_bg.beginFill(color_bg);
    graphics_bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    // stripe = new PIXI.extras.TilingSprite(
    //     PIXI.loader.resources['static/image/stripe.jpg'].texture, 24, 24
    // );
    // stripe.vx = min;
    // stripe.x = _width - 36;
    // stripe.y = 12;
    refresh = new PIXI.Sprite(PIXI.loader.resources["static/svg/refresh-cw-write.svg"].texture);
    refresh.tint = 0xffffff;
    refresh.buttonMode = true;
    refresh.interactive = true;
    refresh.x = _width - 36;
    refresh.y = 12;
    refresh.on('click', setup)
        .on('tap', setup);

    app.stage.addChild(graphics_bg);
    app.stage.addChild(graphics);
    // app.stage.addChild(stripe);
    app.stage.addChild(refresh);
    app.stage.addChild(graphics_line);
    // app.ticker.add(delta => gameLoop(delta));
}
// function gameLoop(delta) {
//     stripe.tilePosition.x += stripe.vx;
// }

//设置事件处理程序
pixi_canvas.addEventListener("mousedown", handleMousedown, false);
pixi_canvas.addEventListener("mousemove", handleMousemove, false);
pixi_canvas.addEventListener("mouseup", handleMouseup, false);
pixi_canvas.addEventListener("touchstart", handleStart, false);
pixi_canvas.addEventListener("touchend", handleEnd, false);
pixi_canvas.addEventListener("touchmove", handleMove, false);

function handleMousedown(evt) {
    is_mousedown = 1;
    mouse_x = evt.clientX;
    mouse_y = evt.clientY;
    graphics_line.beginFill();
    graphics_line.lineStyle(5, color_line);
}
function handleMousemove(evt) {
    evt.preventDefault();
    if (is_mousedown) {
        graphics_line.moveTo(mouse_x, mouse_y);
        graphics_line.lineTo(evt.clientX, evt.clientY);
        inline_function(evt.clientX, evt.clientY);
        mouse_x = evt.clientX;
        mouse_y = evt.clientY;
    }
}
function handleMouseup() {
    is_mousedown = 0;
}
function handleStart(evt) {
    evt.preventDefault();
    let touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        graphics_line.beginFill();
        graphics_line.lineStyle(5, color_line);
        ongoingTouches.push(copyTouch(touches[i]));
    }
}
function handleMove(evt) {
    evt.preventDefault();
    let touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            graphics_line.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            graphics_line.lineTo(touches[i].pageX, touches[i].pageY);
            inline_function(touches[i].pageX, touches[i].pageY)
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        }
        else {
            console.log("can't figure out which touch to continue");
        }
    }
}
function handleEnd(evt) {
    evt.preventDefault();
    let touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}
//拷贝一个触摸对象
function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}
//找出正在进行的触摸
function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier;
        if (id == idToFind) {
            return i;
        }
    }
    return -1;
}
function pointInsideCircle(x, y, circle) {
    if (circle.r === 0) return false;
    let dx = circle.x - x;
    let dy = circle.y - y;
    return dx * dx + dy * dy <= circle.r * circle.r;
}
function pointInsiderectangle(x, y, rectangle) {
    return x >= rectangle.x && x <= rectangle.x + rectangle.width && y >= rectangle.y && y <= rectangle.y + rectangle.height;
}
function inline(x, y) {
    if (y > _width) {
        return pointInsiderectangle(x, y, rectangle1) && !pointInsiderectangle(x, y, rectangle2)
    }
    else {
        return pointInsideCircle(x, y, circle1) && !pointInsideCircle(x, y, circle2)
    }
}
function inline_function(x, y) {
    if (!inline(x, y)) {
        if (color1 >= 0x111111) {
            color1 -= 0x010101;
            // graphics_bg.tint = color1;
        }
    } else {
        if (color1 <= 0xeeeeee) {
            color1 += 0x010101;
            // graphics_bg.tint = color1;
        }
    }
}