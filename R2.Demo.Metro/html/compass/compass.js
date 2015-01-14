(function () {
    "use strict"
    var reportInterval = 0;
    var intervalId = 0;
    var compass;
    var geolocator;
    var time = 0;
    var promise;

    var page = WinJS.UI.Pages.define("html/compass/compass.html", {
        ready: function (element, options) {
            //接收上个页面传过的 参数 并根据参数 加载详细信息
            compassBack();
            compass = Windows.Devices.Sensors.Compass.getDefault();
            geolocator = new Windows.Devices.Geolocation.Geolocator();
            time = setInterval(getCurrentPosition,1000); //每一秒获取一次经纬度
            if (compass) {
                var minimumReportInterval = compass.minimumReportInterval;
                reportInterval = minimumReportInterval > 60 ? minimumReportInterval : 60;
                compass.reportInterval = reportInterval;
                intervalId = setInterval(getCurrentReading, reportInterval);
            } else {
                WinJS.log && WinJS.log("No compass found", "sample", "error");
            }
            appBar.disabled = true;
        },
        unload: function () {

        }
    });

    //返回函数
    function compassBack() {
        $("#compassHeaderIcon,#compassHeaderTitle").click(function () {
            $("#secondClassPages").css("width", "0");
            $("#initPage").css("width", "100%");
            appBar.disabled = false;
        });
    }

    //罗盘转动触发事件
    function getCurrentReading() {
        var reading = compass.getCurrentReading();
        if (reading) {
            var deg = reading.headingMagneticNorth.toFixed(2);
            directionJudge(deg);
            rotateCompass(360-deg);
        }
    }
    //获取经纬度坐标
    function getCurrentPosition() {
        promise = geolocator.getGeopositionAsync();
        promise.done(function (pos) {
            var coord = pos.coordinate;
            var lonlat = coord.longitude;
            var du = Math.floor(lonlat);
            var fen = (lonlat - du) * 60;
            var miao = (fen - Math.floor(fen)) * 60;
            $(".compassLonlat").eq(0).html(du + "°" + Math.floor(fen) + "′" + Math.floor(miao) + "″");
            var lonlat = coord.latitude;
            var du = Math.floor(lonlat);
            var fen = (lonlat - du) * 60;
            var miao = (fen - Math.floor(fen)) * 60;
            $(".compassLonlat").eq(1).html(du + "°" + Math.floor(fen) + "′" + Math.floor(miao) + "″");
        }, function (error) {
        });
    }
    //判断方位
    function directionJudge(deg) {
        if (deg <= 22.5 || deg > 337.5) {
            $("#compassDeg").html("北 " + Math.round(deg) + "°");
            return;
        }
        if (deg >22.5 && deg <= 67.5) {
            $("#compassDeg").html("东北 " + Math.round(deg) + "°");
            return;
        }
        if (deg > 67.5 && deg <= 112.5) {
            $("#compassDeg").html("东 " + Math.round(deg) + "°");
            return;
        }
        if (deg > 112.5 && deg <= 157.5) {
            $("#compassDeg").html("东南 " + Math.round(deg) + "°");
            return;
        }
        if (deg > 157.5 && deg <= 202.5) {
            $("#compassDeg").html("南" + Math.round(deg) + "°");
            return;
        }
        if (deg > 202.5 && deg <= 247.5) {
            $("#compassDeg").html("西南 " + Math.round(deg) + "°");
            return;
        }
        if (deg > 247.5 && deg <= 292.5) {
            $("#compassDeg").html("西 " + Math.round(deg) + "°");
            return;
        }
        if (deg > 292.5 && deg <= 337.5) {
            $("#compassDeg").html("西北 " + Math.round(deg) + "°");
            return;
        }
    }
    //罗盘旋转
    function rotateCompass(deg) {
         $("#compassIn").css("transform", "rotate(" + deg + "deg)");
    }
})();