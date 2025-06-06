let isDragging = false;
let lastX, lastY;

function startDrag(e) {
    if (!window.chrome.webview) return
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
    window.chrome.webview.postMessage(`location`);
}

myCanvas.onmousedown = startDrag