var analyser
let frequencyData

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var mediaStreamSource = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        mediaStreamSource.connect(analyser);
        // analyser.connect(audioContext.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);

        requestAnimationFrame(animationLoop);

    })
let asaaa = 0
function animationLoop() {
    // Your code here
    analyser.getByteFrequencyData(frequencyData)
    // for (let i = 0; i < frequencyData.length; i++) {
    //     if (frequencyData[i] != 0)
    //         console.log(frequencyData[i], frequencyData.length);
    // }
    // console.log(frequencyData)
    // qqq.innerHTML = frequencyData.toString()
    // console.log(new Date().getSeconds(), asaaa++)
    requestAnimationFrame(animationLoop);

    canvasCtx.clearRect(0, 0, oW, oH);
    for (var i = 0; i < frequencyData.length; i++) {
        barHeight = frequencyData[i];
        // 绘制向上的线条
        canvasCtx.fillStyle = color1;
        /* context.fillRect(x,y,width,height)
         * x，y是坐标
         * width，height线条的宽高
         */
        canvasCtx.fillRect(oW / 2 + (i * 8), oH / 2, 2, -barHeight);
        canvasCtx.fillRect(oW / 2 - (i * 8), oH / 2, 2, -barHeight);
        // 绘制向下的线条
        canvasCtx.fillStyle = color2;
        canvasCtx.fillRect(oW / 2 + (i * 8), oH / 2, 2, barHeight);
        canvasCtx.fillRect(oW / 2 - (i * 8), oH / 2, 2, barHeight);
    }
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasCtx = canvas.getContext("2d");
var oW = canvas.width;
var oH = canvas.height;
var color1 = canvasCtx.createLinearGradient(oW / 2, oH / 2 - 10, oW / 2, oH / 2 - 150);
var color2 = canvasCtx.createLinearGradient(oW / 2, oH / 2 + 10, oW / 2, oH / 2 + 150);
color1.addColorStop(0, '#1E90FF');
color1.addColorStop(.25, '#FF7F50');
color1.addColorStop(.5, '#8A2BE2');
color1.addColorStop(.75, '#4169E1');
color1.addColorStop(1, '#00FFFF');

color2.addColorStop(0, '#1E90FF');
color2.addColorStop(.25, '#FFD700');
color2.addColorStop(.5, '#8A2BE2');
color2.addColorStop(.75, '#4169E1');
color2.addColorStop(1, '#FF0000');

