
(function () {
    "use strict";
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var nav = WinJS.Navigation;   //获得Navigation命名空间的引用

    var page = WinJS.UI.Pages.define("/html/singleNavgation.html", {
        ready: function (element, options) {
            //WinJS.Binding.optimizeBindingReferences = true;
            //window.appBarForNavigation = document.getElementById('appbar').winControl;
            home.host2 = document.getElementById("ContentHost1");
            nav.navigate("html/disasterInfoShow.html");
        },
        unload: function () {

        }
    });
})();
