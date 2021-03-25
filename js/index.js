let canvas = document.getElementById("main")
let isDrawing = false
let lineStartPoint = {}
let lineToPoint = {}

let ctx = canvas.getContext("2d")
//初始化画布
initializeCanvas(canvas)
//初始化画笔默认样式
initializeBrushStyle(ctx)
//监听用户动作
monitorUserActions(canvas)


function monitorUserActions(canvas) {
    if (document.body.ontouchstart !== undefined) {
        //触屏设备
        canvas.addEventListener('touchstart', touchStart.bind(null, previousPoint))
        canvas.addEventListener('touchmove', touchMove.bind(null, previousPoint))
        canvas.addEventListener('touchcancel', touchCancel)
    }
    else {
        canvas.addEventListener("mousedown", function (e) {
            isDrawing = true
            lineStartPoint = { x: e.clientX, y: e.clientY }
            drawPoint()
        })
        canvas.addEventListener("mouseup", function (e) {
            isDrawing = false
        })
        canvas.addEventListener("mousemove", function (e) {
            if (isDrawing) {
                lineToPoint = { x: e.clientX, y: e.clientY }
                drawLine()
            }

        })
    }
}
function drawPoint() {
    ctx.beginPath();
    ctx.arc(lineStartPoint.x, lineStartPoint.y, ctx.radius, 0, Math.PI * 2)
    ctx.fill()
}
function drawLine() {
    ctx.beginPath();
    ctx.moveTo(lineStartPoint.x, lineStartPoint.y)
    ctx.lineTo(lineToPoint.x, lineToPoint.y)
    ctx.stroke();
    lineStartPoint = lineToPoint
}


function initializeBrushStyle(ctx) {
    ctx.fillStyle = "black"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.radius = 1
}

function initializeCanvas(canvas) {
    autoSetCanvasSize(canvas)
    window.onresize = function () {
        autoSetCanvasSize(canvas)
        initializeBrushStyle(ctx)
    }
    function autoSetCanvasSize() {
        let pageWidth = document.documentElement.clientWidth
        let pageHeight = document.documentElement.clientHeight
        canvas.width = pageWidth
        canvas.height = pageHeight
    }
}