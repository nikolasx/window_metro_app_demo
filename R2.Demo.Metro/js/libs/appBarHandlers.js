//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF 
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A 
//// PARTICULAR PURPOSE. 
//// 
//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";
   
    WinJS.Namespace.define("AppBarHandlers", {
            ActivateAppBar: function (view, page) {
                /// <summary> 
                /// Called when the view changes, ActivateAppBar changes what buttons are shown on the appbar based 
                /// on what page and view are active
                /// </summary>
                /// <param name="view" type="String">
                /// The current state of the semantic zoom.
                /// </param>
                /// <param name="page" type="String">
                /// The current page that is being viewed.
                /// </param>

                if (typeof view !== "string" ||
                    typeof page !== "string")   {
                    return;
                }

                var appBarHost = document.getElementById("appbar");
                window.appBar = appBarHost.winControl;
                appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-appedgy"));
                appBar.sticky = false;

                if (view === "zoomedout") {
                    
                    appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-misc"));
                }
                else {
                    switch (page) {
                        case "appedgy":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-appedgy"));
                            break;
                        case "systemedgy":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-objectzoom"));
                            break;
                        case "tap":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-tap"));
                            break;
                        case "infoQuery":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-swipe"));
                            break;
                        case "infoShow":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-infoShow"));
                            break;
                        case "rotate":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-rotate"));
                            break;
                        case "semanticzoom":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-semanticzoom"));
                            break;
                        case "pressandhold":
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-pressandhold"));
                            break;
                        default:
                            appBar.showOnlyCommands(appBarHost.querySelectorAll(".appbar-locNormal"));
                            break;
                    }
                }
            }
        });
})();