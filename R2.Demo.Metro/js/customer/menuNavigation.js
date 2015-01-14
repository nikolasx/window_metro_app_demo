var home = {};
//var host1 = document.getElementById("menuBase");
(function () {
    "use strict";
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var menuNav = WinJS.Navigation;   //获得Navigation命名空间的引用


    var page = WinJS.UI.Pages.define("/html/menuNavigation.html", {
        ready: function (element, options) {
            home.host1 = document.getElementById("menuBase");
            //WinJS.Binding.optimizeBindingReferences = true;
            //window.appBarForNavigation = document.getElementById('appbar').winControl;
            //menuNav.navigate(Application.navigator.home);
            menuNav.navigate("html/tilesMenu/tilesMenu.html");
        },
        unload: function () {
        }
    });


})();
