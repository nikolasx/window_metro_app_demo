// 有关“页面控制”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var nav = WinJS.Navigation;
    WinJS.UI.Pages.define("/html/tilesMenu/tilesMenu.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。
            //initAppBar();
            var btn = document.getElementById("itemsJccx");
            var btn1 = document.getElementById("itemsQftx");
            var btn2 = document.getElementById("itemsfZgh");
            var btn3 = document.getElementById("itemsQfjc");
            var btn4 = document.getElementById("itemsZlgc");
            var btn5 = document.getElementById("itemsYjdc");
            var btn6 = document.getElementById("itemsYjzj");
            btn.addEventListener("click", showMessage, false);
            btn1.addEventListener("click", showMessage, false);
            btn2.addEventListener("click", toDisaInfoStatistics, false);
            btn3.addEventListener("click", toPaintCanvas, false);
            btn4.addEventListener("click", showMessage, false);
            btn5.addEventListener("click", toDisaInfoQuery, false);
            btn6.addEventListener("click",toCompass,false);
            //addMenuBtnHover();
        },

        unload: function () {
            //AppBarSampleUtils.removeAppBars();
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 响应 viewState 的更改。
        }
    });
    //注册按钮选中hover效果
    function addMenuBtnHover() {
        $("#itemsfZgh").hover(function () {
            $(this).css({"border":"2px solid white"});
        }, function () {
            $(this).css({ "border": "0px solid white" });
        });
    }
    function initAppBar() {
        var appBarDiv = document.getElementById("customIconsAppBar");
        var appBar = document.getElementById("customIconsAppBar").winControl;
        appBar.onbeforeshow = getafsf;
        // Disable AppBar until in full screen mode
    }

    //跳转到灾害统计页面
    function toDisaInfoStatistics() {
        nav.navigate("html/disasterInfoStatistics/disasterInfoStatistics.html");
    }
    //跳转到信息查询页面
    function toDisaInfoQuery() {
        nav.navigate("html/disasterInfoQuery.html");
    }
    //跳转到手绘功能
    function toPaintCanvas() {
        nav.navigate("html/paint/paint.html");
    }
    function toCompass() {
        nav.navigate("html/compass/compass.html");
    }
    function getafsf(evt) {
        var otherAppBars = document.querySelectorAll('div[data-win-control="WinJS.UI.AppBar"]');
        var len = otherAppBars.length;
        for (var i = 0; i < len; i++) {
            var otherScenarioAppBar = otherAppBars[i];
            otherScenarioAppBar.disabled = true;
        }
    }

    function showMessage() {
        var md = new Windows.UI.Popups.MessageDialog('该模块正在建设中，敬请请期待!', '提示');
        md.showAsync();
    }

})();

