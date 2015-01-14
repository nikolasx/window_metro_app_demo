(function () {
    "use strict"
    var HPListView;
    var ListViewItem;
    var isback = true;
    var page = WinJS.UI.Pages.define("html/historyPaint/historyPaint.html", {
        ready: function (element, options) {
            //接收上个页面传过的 参数 并根据参数 加载详细信息
            initFunction();
            historyPaintBack();
            addHPClick();
        },
        unload: function () {

        }
    });
    //返回跳转
    function historyPaintBack() {
        $("#HPheadIcon,#HPheadTitle").click(function () {
            if (isback) {
                WinJS.Navigation.navigate("html/paint/paint.html");
            } else {
                $("#HPMax").hide();
                $("#HPcontent").show();
                hpappBar.disabled = false;
                isback = true;
            }
        });
    }
    //初始化函数
    function initFunction() {
        for (var i = 0; i < 8 && i < paintImg.length; i++) {
            $(".hpimgbox").eq(i).css({ "width": "242px", "height": "172px", "border": "4px solid #6b747d" });
            $(".hpimg").eq(i).css({"background-color":"#ffffff","margin":"6px"});
            $(".hpimg").eq(i).attr("src", paintImg[i].picture);
            $(".hpname").eq(i).html(paintImg[i].name);
        }
        //加载时添加应用栏事件
        window.HPappBarHost = document.getElementById("hpappBar");
        window.HPappBar = appBarHost.winControl;

        //添加应用栏按钮点击事件
        var btnLinks = document.getElementById("btnDeleteHP").winControl;
        btnLinks.addEventListener("click", deletePaint, false);

        var btnLinks = document.getElementById("btnMaxHP").winControl;
        btnLinks.addEventListener("click", MaxPaint, false);
    }

    var paintSelect;
    //历史画布选中效果
    function addHPClick() {
        $(".hpimgbox").click(function () {
            var index = $(".hpimgbox").index(this);
            document.getElementById("hpappBar").winControl.show();
            paintSelect = index;
            if (index < paintImg.length) {
                $(".hpimgbox").css("border-color", "#6b747d");
                $(".hpimgbox").eq(index).css("border-color", "#ff8400");
            }
        });
    }
    //删除选中的画布
    function deletePaint(){
        if (paintSelect||paintSelect=="0") {
            paintImg.splice(paintSelect, 1); //删除数组中的某项
            paintSelect = null;
            //重新排布画布
            $(".hpimgbox").css({ "width": "250px", "height": "180px", "border": "0px solid #6b747d" });
            $(".hpimg").css({ "background-color": "#3a4651", "margin": "10px" });
            $(".hpimg").attr("src", "../../images/previewimg.png");
            $(".hpname").html("");
            for (var i = 0; i < 8 && i < paintImg.length; i++) {
                $(".hpimgbox").eq(i).css({ "width": "242px", "height": "172px", "border": "4px solid #6b747d" });
                $(".hpimg").eq(i).css({ "background-color": "#ffffff", "margin": "6px" });
                $(".hpimg").eq(i).attr("src", paintImg[i].picture);
                $(".hpname").eq(i).html(paintImg[i].name);
            }
        }
    }
    //查看
    function MaxPaint() {
        if (paintSelect || paintSelect == 0) {
            document.getElementById("hpappBar").winControl.hide();
            $("#HPcontent").hide();
            $("#HPMax").attr("src", paintImg[paintSelect].picture);
            $("#HPMax").show();
            isback = false;
            hpappBar.disabled = true;
        }
    }
})();