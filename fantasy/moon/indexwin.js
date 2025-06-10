let isDragging = false;
let lastX, lastY;

function startDrag(e) {
    if (!window.chrome.webview) return
    if (!isMouseInMoon(e)) return
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}
function handleDrag(e) {
    if (!isDragging) return;
    window.chrome.webview.postMessage(`drag:${e.clientX - lastX}:${e.clientY - lastY}`);
}
function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

function saveLocation() {
    window.chrome.webview?.postMessage(`location`);
}
function sendWinform(msg) {
    window.chrome.webview?.postMessage(msg);
}

window.chrome.webview?.addEventListener('message', (event) => {
    const message = event.data;

    // if (message == ('focused')) {
    //     in_moon = true
    // }
    // else if (message == ('blured')) {
    //     in_moon = false
    // }

    // if (in_moon) return
    if (message.startsWith('mousePos:')) {
        const parts = message.split(':')[1].split(',');
        const x = parseInt(parts[0]);
        const y = parseInt(parts[1]);
        var e = { clientX: x, clientY: y }

        if (isMouseInMoon(e)) {
            canvas.style.cursor = 'pointer';
            sendWinform('focus');
        }
    }
});

document.onmousedown = startDrag