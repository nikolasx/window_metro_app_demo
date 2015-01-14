/*初始化装载页面的页面容器js文件*/
(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/initPageContainer/initPage.html", {
        ready: function (element, options) {
            initPage.init();
        },
        unload: function () {
        }
    });

    var initPage = {
        //页面加载初始化方法，向页面容器中添加一级菜单页面
        init: function () {
            //添加html到基本页面
            window.zoomedInView = document.getElementById("view-zoomedin").winControl;
            zoomedInView.addPage("html/mapHome/mapHome.html", "appedgy");
            zoomedInView.addPage("html/tilesMenu/tilesMenu.html", "tilesMenu");
            zoomedInView.addPage("html/disasterInfoShow.html", "infoShow");
            zoomedInView.addPage("html/disasterInfoInput.html", "infoInput");
            zoomedInView.addPage("html/appSet.html", "appSet");
            
            //添加各个界面的缩略界面
            window.zoomedOutView = document.getElementById("view-zoomedout").winControl;
            zoomedOutView.addPage("html/mapHomePreview.html", "preview-home");
            zoomedOutView.addPage("html/menuPreview.html", "preview-menu");
            zoomedOutView.addPage("html/disasterInfoShowPreview.html", "preview-show");
            zoomedOutView.addPage("html/disasterInfoInputPreview.html", "preview-input");
            zoomedOutView.addPage("html/appSetPreview.html", "preview-appSet");

            zoomedInView.registerViewChangeHandler(AppBarHandlers.ActivateAppBar);
            zoomedOutView.registerViewChangeHandler(AppBarHandlers.ActivateAppBar);

            ////初次加载时，只加载地图主页的应用栏按钮
            window.appBarHost = document.getElementById("appbar");
            window.appBar = appBarHost.winControl;
            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-appedgy"));
        }
    }
})();