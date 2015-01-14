
(function () {
    "use strict";
    var nav = WinJS.Navigation;

    var page = WinJS.UI.Pages.define("/html/testpage2.html", {
        ready: function (element, options) {
            var ss = window.parent.document.getElementById("btnShowSbItemDetail");
            appBarForNavigation.hide();
            appBarForNavigation.sticky = false;
            //var showDetail = document.getElementById("btnShowSbItemDetail").winControl;
        },
        unload: function () {
          //  AppBarSampleUtils.removeAppBars();
        }
    });

})();