let canvas = document.getElementById("main")
let colorpanel = document.getElementById("colorpanel")
let toolspanel = document.getElementById("toolspanel")
let toolEraser = document.getElementById("tool-eraser")
let toolspenpanel = document.getElementById("toolspenpanel")
let penwidth = document.querySelectorAll(".penwidth")
let penline = document.getElementById("penline")
let baocun = document.getElementById("baocun")
let clean = document.getElementById("clean")
let isEraser = false
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

penline.addEventListener("click", function (e) {
    switch (e.target.id) {
        case "fine":
            ctx.lineWidth = 2
            ctx.radius = 1
            break;
        case "middle":
            ctx.lineWidth = 6
            ctx.radius = 3
            break;
        case "crude":
            ctx.lineWidth = 10
            ctx.radius = 5
            break;

        default:
            break;
    }

    if (e.target.className === "penwidth") {
        penwidth.forEach(function (item) {
            item.className = "penwidth"
            if (item === e.target) {
                item.className = "penwidth active_line"
            }

        })
    }
})

colorpanel.addEventListener("click", function (e) {
    if (e.target.className === "pencolor") {
        let pencolor = e.target.getAttribute("data-color")
        initializeBrushStyle(ctx, pencolor, pencolor, ctx.lineWidth, ctx.radius)
        let pencolors = document.querySelectorAll(".pencolor")
        pencolors.forEach(function (item) {
            item.className = "pencolor"
            if (pencolor === item.getAttribute("data-color")) {
                item.className = "pencolor active-colors"
            }
        })
    }

})
toolEraser.addEventListener("click", function (e) {
    colorpanel.className = "tools-colors active-tools-colors-none"
    toolspenpanel.className = "tools-itme draw-pen"
    this.className = "active"
    isEraser = true
})
toolspenpanel.addEventListener("click", function (e) {

    colorpanel.className = "tools-colors active-tools-colors"
    toolEraser.className = ""
    isEraser = false
    this.className = "tools-itme draw-pen active"
})
clean.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})
baocun.addEventListener("click", function () {
    let a = document.createElement("a")
    a.href = canvas.toDataURL()           //获得图片地址
    a.target = "_blank"
    a.download = "image.png"
    a.click()
})
function monitorUserActions(canvas) {
    if (document.body.ontouchstart !== undefined) {
        //触屏设备
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault()
            let x, y
            for (let touch of e.changedTouches) {
                x = Math.floor(touch.clientX)
                y = Math.floor(touch.clientY)
                console.log(x, y);
                if (!isEraser) {
                    lineStartPoint = { x: x, y: y }
                    drawPoint()
                } else {
                    ctx.clearRect(x - 5, y - 5, 10, 10)
                }
            }
        })
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault()
            let x, y
            for (let touch of e.changedTouches) {
                x = Math.floor(touch.clientX)
                y = Math.floor(touch.clientY)
                if (!isEraser) {
                    //newPoint[touch.identifier] = { x: x, y: y }
                    lineToPoint = { x: x, y: y }
                    drawPoint()           //需要添加此函数才不会使得画出来的线在lineWidth变大时不完整
                    drawLine()
                }
                else {
                    ctx.clearRect(x - 8, y - 8, 16, 16)
                }
            }
        })
        canvas.addEventListener('touchcancel', () => {
            alert("Oops! 小手指头太多啦~!(•'╻'•)꒳ᵒ꒳ᵎ忙不过了哦！")
        })
    }
    else {
        canvas.addEventListener("mousedown", function (e) {
            isDrawing = true
            lineStartPoint = { x: e.clientX, y: e.clientY }
            if (isDrawing && !isEraser) {
                drawPoint()
            }

        })
        canvas.addEventListener("mouseup", function (e) {
            isDrawing = false
        })
        canvas.addEventListener("mousemove", function (e) {
            if (isDrawing && !isEraser) {
                lineToPoint = { x: e.clientX, y: e.clientY }
                drawPoint()
                drawLine()
            }
            if (isDrawing && isEraser) {
                ctx.clearRect(e.clientX - 8, e.clientY - 8, 16, 16)
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
function clearRect() {
    ctx.beginPath();
    ctx.clearRect()
    ctx.stroke();
    lineStartPoint = lineToPoint
}

function initializeBrushStyle(ctx, fillStyle = "black", strokeStyle = "black", lineWidth = 2, radius = 1) {
    ctx.fillStyle = fillStyle
    ctx.strokeStyle = strokeStyle
    ctx.lineWidth = lineWidth
    ctx.radius = radius
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