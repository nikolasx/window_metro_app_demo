(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("html/paint/paint.html", {
        ready: function (element, options) {
            //接收上个页面传过的 参数 并根据参数 加载详细信息
            appBar.disabled = true;
            addPaintBack();
            addPaintToolClick();
            init();
        },
        unload: function () {

        }
    });
    function addPaintBack() {
        $("#paintTitleIcon,#paintTitle").click(function () {
            appBar.disabled = false;
            if (!isSave) {
                createSaveCanvasPopusMessage("返回");
            } else {
                $("#secondClassPages").css("width", "0");
                $("#initPage").css("width", "100%");
            }
        });
        $("#paintBtn").click(function () {
            $(this).css("background-color","#a8a8a8");
            WinJS.Promise.timeout(200).then(function () {
                var imgURI = canvas.toDataURL("image/png");
                var name=$("#paintName").val();
                if(name==""){
                    name="山体剖面图";
                }
                var pic = { name:name, picture: imgURI };
                //最多插入八张手绘图
                if (paintImg.length < 8) {
                    paintImg.push(pic);
                }
                isSave = true;
                clearCanvas();// 清空画布
                $("#paintBtn").css("background-color", "#007acc");
                $("#paintBackground").hide();
            });
        });
    }
    //画图
    var context;
    var brushList;
    var canvas;
    var output;
    var animationActive = false;
    var paintFlag = true; //画图和橡皮擦状态判断,true为画图，false为擦除
    var isSave = true;

    function init() {
        canvas = document.getElementById("paintCanvas");
        canvas.width = $("#paintCanvas").width();
        canvas.height = $("#paintCanvas").height();
        context = canvas.getContext("2d");
        paint();
    }
    function paint() {
        if (paintFlag == false) {
            canvas.removeEventListener("MSPointerDown", canvasEraserHander, false);
            canvas.removeEventListener("MSPointerMove", canvasEraserHander, false);
            canvas.removeEventListener("MSPointerUp", canvasEraserHander, false);
            canvas.removeEventListener("MSPointerOver", canvasEraserHander, false);
            canvas.removeEventListener("MSPointerOut", canvasEraserHander, false);
            canvas.removeEventListener("MSPointerCancel", canvasEraserHander, false);
            brushList.length = 0;
        }
        paintFlag = true;
        canvas.addEventListener("MSPointerDown", canvasHandler, false);
        canvas.addEventListener("MSPointerMove", canvasHandler, false);
        canvas.addEventListener("MSPointerUp", canvasHandler, false);
        canvas.addEventListener("MSPointerOver", canvasHandler, false);
        canvas.addEventListener("MSPointerOut", canvasHandler, false);
        canvas.addEventListener("MSPointerCancel", canvasHandler, false);
        context.lineWidth = $("#paintLineWidthSelect").val();
        context.strokeStyle = $("#paintLineColorSelect").val();
        context.lineCap = "round";
        context.lineJoin = "round";

        //initColorPalette();
        //initToolbar();

        brushList = new Array();
        
    }
    //橡皮擦
    function eraser() {
        //先清空绘图的事件
        canvas.removeEventListener("MSPointerDown", canvasHandler, false);
        canvas.removeEventListener("MSPointerMove", canvasHandler, false);
        canvas.removeEventListener("MSPointerUp", canvasHandler, false);
        canvas.removeEventListener("MSPointerOver", canvasHandler, false);
        canvas.removeEventListener("MSPointerOut", canvasHandler, false);
        canvas.removeEventListener("MSPointerCancel", canvasHandler, false);
        brushList.length = 0;
        paintFlag = false;
        canvas.addEventListener("MSPointerDown", canvasEraserHander, false);
        canvas.addEventListener("MSPointerMove", canvasEraserHander, false);
        canvas.addEventListener("MSPointerUp", canvasEraserHander, false);
        canvas.addEventListener("MSPointerOver", canvasEraserHander, false);
        canvas.addEventListener("MSPointerOut", canvasEraserHander, false);
        canvas.addEventListener("MSPointerCancel", canvasEraserHander, false);
    }
    //添加工具栏点击事件
    function addPaintToolClick() {
        //设置画笔粗细
        $("#paintLineWidthSelect").change(function () {
            var value = $(this).val();
            context.lineWidth = value;
        });
        //设置画笔颜色
        $("#paintLineColorSelect").change(function () {
            var value = $(this).val();
            context.strokeStyle = value;
        });
        //清空画布
        $("#paintClear").click(function () {
            clearCanvas();
        });
        //橡皮擦
        $("#paintLineClear").toggle(function () {
            eraser();
            $(this).css("background-color", "#0a63a7");
        }, function () {
            paint();
            $(this).css("background-color", "#171c22");
        });
        //历史画布
        $("#paintHistory").click(function () {
            if (!isSave) {
                createSaveCanvasPopusMessage("历史画布");
            } else {
                WinJS.Navigation.navigate("html/historyPaint/historyPaint.html");
            }
        });
        //保存画布
        $("#paintSave").click(function () {
            if (!isSave) {
                savePaint();
            }
        });
    }
    //清空画布
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        brushList.length = 0;
        isSave = true;
    }
 
    function brushTool() {
        var brush = this;
        brush.started = false;
        brush.over = false;
        brush.prevX = 0;
        brush.prevY = 0;
        brush.currentX = 0;
        brush.currentY = 0;
        brush.lineWidth = context.lineWidth;

        // Even though the choice of raw coordinates over predicted coordinates has performance
        // overhead we will use raw coordinates because predicted coordinates don't give
        // accurate results for our purpose.
        this.MSPointerDown = function (evt) {
            canvas.msSetPointerCapture(evt.pointerId);
            brush.currentX = evt.currentPoint.rawPosition.x;
            brush.currentY = evt.currentPoint.rawPosition.y;
            brush.prevX = brush.currentX;
            brush.prevY = brush.currentY;
            brush.started = true;
            brush.over = true;
            if (!animationActive) {
                window.requestAnimationFrame(animationHandler);
                animationActive = true;
            }
        };

        this.MSPointerOver = function (evt) {
            brush.over = true;
            if (brush.started) {
                brush.currentX = evt.currentPoint.rawPosition.x;
                brush.currentY = evt.currentPoint.rawPosition.y;
            } else if (evt.currentPoint.isInContact) {
                // If the Down occurred outside of the canvas element but the pointer is in contact,
                // simulate the Down behavior when the pointer enters the canvas
                brush.MSPointerDown(evt);
            }
        };

        this.MSPointerMove = function (evt) {
            if (brush.started) {
                // Adjust the line width by reading the contact width from
                // the event parameter. Use a width of 1 for pen and mouse.
                //if (evt.pointerType === evt.MSPOINTER_TYPE_TOUCH) {
                //    brush.lineWidth = context.width;
                //} else {
                //    brush.lineWidth = context.width;
                //}
                brush.lineWidth = context.width;
                brush.currentX = evt.currentPoint.rawPosition.x;
                brush.currentY = evt.currentPoint.rawPosition.y;
            }
        };

        this.MSPointerUp = function (evt) {
            canvas.msReleasePointerCapture(evt.pointerId);
            brush.started = false;
        };

        this.MSPointerOut = function (evt) {
            brush.over = false;
        };

        this.MSPointerCancel = function (evt) {
            brush.over = false;
            brush.started = false;
        };
    }

    //清除操作集合
    function EraserTool() {
        var brush = this;
        brush.started = false;
        brush.over = false;
        brush.prevX = 0;
        brush.prevY = 0;
        brush.currentX = 0;
        brush.currentY = 0;
        brush.lineWidth = context.lineWidth;

        // Even though the choice of raw coordinates over predicted coordinates has performance
        // overhead we will use raw coordinates because predicted coordinates don't give
        // accurate results for our purpose.
        this.MSPointerDown = function (evt) {
            canvas.msSetPointerCapture(evt.pointerId);
            brush.currentX = evt.currentPoint.rawPosition.x;
            brush.currentY = evt.currentPoint.rawPosition.y;
            brush.prevX = brush.currentX;
            brush.prevY = brush.currentY;
            brush.started = true;
            brush.over = true;
            if (!animationActive) {
                window.requestAnimationFrame(animationEraserHandler);
                animationActive = true;
            }
        };

        this.MSPointerOver = function (evt) {
            brush.over = true;
            if (brush.started) {
                brush.currentX = evt.currentPoint.rawPosition.x;
                brush.currentY = evt.currentPoint.rawPosition.y;
            } else if (evt.currentPoint.isInContact) {
                // If the Down occurred outside of the canvas element but the pointer is in contact,
                // simulate the Down behavior when the pointer enters the canvas
                brush.MSPointerDown(evt);
            }
        };

        this.MSPointerMove = function (evt) {
            if (brush.started) {
                // Adjust the line width by reading the contact width from
                // the event parameter. Use a width of 1 for pen and mouse.
                if (evt.pointerType === evt.MSPOINTER_TYPE_TOUCH) {
                    brush.lineWidth = evt.width / 2;
                } else {
                    brush.lineWidth = context.width;
                }
                brush.currentX = evt.currentPoint.rawPosition.x;
                brush.currentY = evt.currentPoint.rawPosition.y;
            }
        };

        this.MSPointerUp = function (evt) {
            canvas.msReleasePointerCapture(evt.pointerId);
            brush.started = false;
        };

        this.MSPointerOut = function (evt) {
            brush.over = false;
        };

        this.MSPointerCancel = function (evt) {
            brush.over = false;
            brush.started = false;
        };
    }
  
    function canvasHandler(evt) {
        var brush;
        var func;

        if (brushList[evt.pointerId] === null ||
            brushList[evt.pointerId] === undefined) {
            brushList[evt.pointerId] = new brushTool();
        }

        brush = brushList[evt.pointerId];

        func = brush[evt.type];
        func(evt);

        if (!brush.started && !brush.over) {
            // clean up when the brush is finished
            delete brushList[evt.pointerId];
        }
    }

    //清除事件
    function canvasEraserHander(evt) {
        var brush;
        var func;

        if (brushList[evt.pointerId] === null ||
            brushList[evt.pointerId] === undefined) {
            brushList[evt.pointerId] = new EraserTool();
        }

        brush = brushList[evt.pointerId];

        func = brush[evt.type];
        func(evt);

        if (!brush.started && !brush.over) {
            // clean up when the brush is finished
            delete brushList[evt.pointerId];
        }
    }

    function animationHandler() {
        animationActive = false;
        for (var idx in brushList) {
            var currentBrush = brushList[idx];
            if (currentBrush.started) {
                context.beginPath();
                context.lineWidth = currentBrush.lineWidth;
                context.moveTo(currentBrush.prevX, currentBrush.prevY);
                context.lineTo(currentBrush.currentX, currentBrush.currentY);
                context.stroke();
                isSave = false;  //画布有改动
                currentBrush.prevX = currentBrush.currentX;
                currentBrush.prevY = currentBrush.currentY;
                animationActive = true;
            }
        }
        if (animationActive) {
            // Request for another callback until all pointers are gone.
            window.requestAnimationFrame(animationHandler);
        }
    }
    //清除笔画的方法
    function animationEraserHandler() {
        animationActive = false;
        for (var idx in brushList) {
            var currentBrush = brushList[idx];
            if (currentBrush.started) {
                context.clearRect(currentBrush.currentX - 20, currentBrush.currentY - 20, 40, 40);
                isSave = false; //画布有改动
                currentBrush.prevX = currentBrush.currentX;
                currentBrush.prevY = currentBrush.currentY;
                animationActive = true;
                $("#canvasEraser").clentWidth = currentBrush.currentX - 8;
                $("#canvasEraser").clentHeight = currentBrush.currentY - 8;
            }
        }
        if (animationActive) {
            // Request for another callback until all pointers are gone.
            window.requestAnimationFrame(animationEraserHandler);
        }
    }

    //建立数据库，将画布保存
    window.paintImg = [];
    function savePaint() {
        //得到base64的图片编码
        $("#paintBackground").show();
        //var imgURI = canvas.toDataURL("image/png");
        //var pic = { name: paintImg.length + 1, picture: imgURI };
        ////最多插入八张手绘图
        //if (paintImg.length<8) {
        //    paintImg.push(pic);
        //}
        //isSave = true;
        //clearCanvas();// 清空画布
    }
    //弹出保存画布提示框
    function createSaveCanvasPopusMessage(topage) {
        var md = new Windows.UI.Popups.MessageDialog('画布没有保存，请先保存！', '提示');
        var result, resultOptions = ['保存', '不保存'];
        var cmd;
        for (var i = 0; i < resultOptions.length; i++) {
            cmd = new Windows.UI.Popups.UICommand();
            cmd.label = resultOptions[i];
            cmd.invoked = function (c) {
                result = c.label;
                if (result == '保存') {
                    savePaint();
                    if (topage == "历史画布") {
                        WinJS.Navigation.navigate("html/historyPaint/historyPaint.html");
                    }
                    if (topage == "返回") {
                        $("#secondClassPages").css("width", "0");
                        $("#initPage").css("width", "100%");
                    }
                } else {
                    if (topage == "历史画布") {
                        WinJS.Navigation.navigate("html/historyPaint/historyPaint.html");
                    }
                    if (topage == "返回") {
                        $("#secondClassPages").css("width", "0");
                        $("#initPage").css("width", "100%");
                    }
                }
            }
            md.commands.append(cmd);
        }
        //显示弹出框
        md.showAsync();
    }

})();