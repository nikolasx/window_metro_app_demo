
// 有关“页面控制”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    
    var page = WinJS.UI.Pages.define("/html/mapHome/mapHome.html", {
        ready: function (element, options) {
            initMap();      //初始化地图
            initAppBar(); //初始化Appbar
            controlBottomStyle();  //动态控制底部按钮样式
            initFunction();   // 初始化控件事件
            appbarIconLock(); //应用栏按钮灰色处理
        },
        unload: function () {
            AppBarSampleUtils.removeAppBars();
        }
    });

    //加载地图
    function initMap() {
        //判断当前是否本地地图  fileState为1 表示已下载 ；3为未下载
        window.fileState = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("map").operation.status;
        if (fileState == 3) {
            //用一个图片替代地图
            $("#lockDiv").css({'background':'url(../images/fullMap.png) 0 0 no-repeat','opacity':'1'});
        }
        //获得重写后的 draw方法，为了解决双指操作时地图晃动问题
        var draw = new OpenLayers.Control.customeDragPan().draw;
        var nav = new OpenLayers.Control.TouchNavigation({
            dragPanOptions: {
                draw: draw,
                enableKinetic: 0.00135  //滑动惯性大小
            },
            autoActivate: false  //不自动激活，防止双指操作时地图晃动
        });
        window.map = new OpenLayers.Map("map", {
            maxExtent: new OpenLayers.Bounds(12523442.7142433, 3130860.67856082, 13149614.8499554, 3757032.81427292),
            controls: [nav],
            numZoomLevels: 7,
            maxResolution: 2445.984921875,
            //units: 'meters',
            //projection: 'EPSG:900913',
            //maxResolution: 0.02197265625,
            theme: null
        });

        //定义瓦片图层
        var titleLayerApp = new Zondy.Map.TileLayerForMetro("myAppDitu", "", {
                baseUrl: "ms-appdata:///local/map/IMG"
            }
        );
        var titleLayer = new Zondy.Map.TileLayer("ditu", "DLWIN8", {
            ip: '192.168.83.185',
            port: '6163',
            transitionEffect: 'resize'
        });
        //添加图层
        map.addLayer(titleLayerApp);
        //map.addControl(new OpenLayers.Control.MousePosition());
        window.currentPositionLayer = new OpenLayers.Layer.Markers("currentPosition");
        map.addLayer(currentPositionLayer);
        /*地图初始中心 ,区分是否有本地地图的原因是
        *当有时，直接定位到3级;
        * 没有时，下载完地图时会重新设定中心也是3级，但是当前视口的瓦片会不可见，用这个方法解决
        */
        if (fileState == 3) {
            map.setCenter(new OpenLayers.LonLat(12734849.6, 3565059.8), 2);
        }
        else if (fileState == 1) {
            map.setCenter(new OpenLayers.LonLat(12734849.6, 3565059.8), 3);
            
            addmark();
            var time = setInterval(addCurrentPosition,10000);
           
        }
        
        window.orginBounds = map.getMaxExtent();
        nav.activate(); //激活
    }
   
    
    
    function addCurrentPosition() {
        var currentPosition = getCurrentPosition(function (position) {
            if (position) {
                var lon = position.longitude;
                var lat = position.latitude;
                var lonlat = new OpenLayers.LonLat(lon, lat)
                lonlat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
                var size = new OpenLayers.Size(35, 35);
                var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h/2));
                var icon = new OpenLayers.Icon('../images/flashmark.gif', size, offset);
               
                currentPositionLayer.clearMarkers();
                currentPositionLayer.addMarker(new OpenLayers.Marker(lonlat, icon));
            }
        });
    }
    //初始化的时候，在地图上添加一些mark点
   
    //定义mark点图层
    var markVector = new OpenLayers.Layer.Vector();
    
    function addmark() {
        map.addLayer(markVector);
        var data = [{ lon: 12532544, lat: 3617170 },
            { lon: 12942577, lat: 3655240 },
            { lon: 12842864, lat: 3670310 },
            { lon: 12620384, lat: 3616532 },
            { lon: 12637654, lat: 3684320 },
            { lon: 12667875, lat: 3609210 },
            { lon: 12734567, lat: 3550986 },
            { lon: 12710321, lat: 3530215}];
        
        for (var i = 0; i < data.length; i++) {
            if (i % 3 == 0) {
                circle(data[i].lon, data[i].lat, "red");
            } else if (i % 3 == 1) {
                circle(data[i].lon, data[i].lat, "blue");
            } else {
                circle(data[i].lon, data[i].lat, "green");
            }
        }
       
    }
    function circle( e1, e2,color) {
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 1;
        layer_style.graphicOpacity = 1;
        var style_blue = OpenLayers.Util.extend({}, layer_style);
        style_blue.strokeColor = "black";
        style_blue.fillColor = color;
        style_blue.graphicName = "circle";
        style_blue.pointRadius = 8;
        style_blue.strokeWidth = 1;
        style_blue.rotation = 0;
        style_blue.strokeLinecap = "butt";
        var mark = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(e1, e2), null, style_blue);
        markVector.addFeatures(mark);
    }
    //应用栏图标不可用的灰色处理
    function appbarIconLock() {
        $("#btnYf").css("opacity", "0.5");
        $("#btnFz").css("opacity", "0.5");
        $("#btnDt").css("opacity", "0.5");
        $("#btnFw").css("opacity", "0.5");
        $("#btnCj").css("opacity", "0.5");
        $("#btnCm").css("opacity", "0.5");
        $("#btnGps").css("opacity", "0.5");
    }
    function appbarIconUNlock() {
        $("#btnYf").css("opacity", "1");
        $("#btnFz").css("opacity", "1");
        $("#btnDt").css("opacity", "1");
        $("#btnFw").css("opacity", "1");
        $("#btnCj").css("opacity", "1");
        $("#btnCm").css("opacity", "1");
        $("#btnGps").css("opacity", "1");
    }

    //初始化应用栏
    function initAppBar() {

        //锁屏控制
        var btnLinks = document.getElementById("btnLocHomeMap").winControl;
        btnLinks.addEventListener("click", doClickLo, false);

        //易发分区图
        var btnLinks = document.getElementById("btnYf").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

        //防治分区图
        var btnLinks = document.getElementById("btnFz").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

        //系统底图
        var btnLinks = document.getElementById("btnDt").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

        //复位
        var btnLinks = document.getElementById("btnFw").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

        //测距
        var btnLinks = document.getElementById("btnCj").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

        //测面积
        var btnLinks = document.getElementById("btnCm").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

        //gps路径
        var btnLinks = document.getElementById("btnGps").winControl;
        btnLinks.addEventListener("click", addVexctor, false);

    }

    var isShowBottomControl = false;
    window.lockState = false; //锁上不能滑屏
    function initFunction() {

        $("#lockDiv").css("width", $("#map").css("width"));
        //显示矢量图层和锁的控制菜单 
        $("#moreBtn").click(function (evt) {
            evt.stopPropagation();
            document.getElementById('appbar').winControl.show();
        });
    }

    //控制易发分区样式
    function setFenquStyle() {
        $(".controlItemName").css("color", "#7E8184");
        $("#fafqItemImg").css("background", "url(../images/mapMoreControls/02.png) 0 0 no-repeat");
        $("#yffqItemImg").css("background", "url(../images/mapMoreControls/03.png) 0 0 no-repeat");
        $("#xtdtItemImg").css("background", "url(../images/mapMoreControls/04.png) 0 0 no-repeat");
    }

    function doClickLo(evt) {
        if (fileState == 3) {
            var md = new Windows.UI.Popups.MessageDialog('未下载系统底图数据，请到系统设置页面下载系统底图数据。', '提示');
            //显示弹出框
            md.showAsync();
        }
        else if (fileState == 1) {
           // appBar.hide();
            //更改锁屏div的背景图透明度
            $("#lockDiv").css({ 'background': '', 'opacity': '0' });

            var obj = $(this);
            var btnLin = document.getElementById(obj.context.id).winControl;
            if (lockState) {
                btnLin.icon = "url(images/mapMoreControls/unlocked.png)";
                $("#lockDiv").css("visibility", "visible");
                $("#lockDiv").css("width", "1366px");
                lockState = false;

                //恢复滚动
                // $(".pagezoom-view").css("overflow-x", "auto");
                
                $(".pagezoom-canvas").css("position","absolute");
                appbarIconLock();
            }
            else {
                btnLin.icon = "url(images/mapMoreControls/locked.png)";
                $("#lockDiv").css("visibility", "hidden");
                lockState = true;
                
                //不能滚动，只能操作地图
                // $(".pagezoom-view").css("overflow-x", "hidden");
                $(".pagezoom-view").scrollLeft(0);
                $(".pagezoom-canvas").css({ "position": "fixed", "left": "0" });
                appbarIconUNlock();
            }
        }
    }

    //矢量图层的加载
    function addVexctor(evt) {
        if (lockState) {
            var obj = $(this);
            var objId = obj.context.id;
            var imgName = "";
            //var reg=/^\s+|\s+$/g;
            //var name = obj.context.innerText.replace(reg, "");
            //var name = obj.context.innerText.split(' ')[1];
            switch (objId) {
                case "btnYf":
                    imgName = "02-1.png";
                    getVectorLayer("易发分区");
                    break;
                case "btnFz":
                    imgName = "03-1.png";
                    getVectorLayer("防治分区");
                    break;
                case "btnDt":
                    imgName = "04-1.png";
                    getVectorLayer("");
                    break;
                case "btnFw":
                    imgName = "04-1.png";
                    map.setCenter(new OpenLayers.LonLat(12734849.6, 3565059.8), 3);
                    break;
                case "btnCj":       //测距
                    imgName = "04-1.png";
                    getLength();
                    break;
                case "btnCm":    //测面积
                    imgName = "04-1.png";
                    getArea();
                    break;
                case "btnGps":
                    addGps();
                    break;
                default:
                    break;
            }
        }
    }

    //添加测距功能
    function getLength() {
        appBar.hide();
        var controls = new RRteam.Control.Measure(OpenLayers.Handler.Path);
        map.addControl(controls);
        cleanFormer(controls);
    }
    //添加测面积功能
    function getArea() {
        appBar.hide();
        var controls = new RRteam.Control.Measure(OpenLayers.Handler.Polygon);
        map.addControl(controls);
        cleanFormer(controls);
    }
    //激活控件
    function cleanFormer(control) {
        if (control) {
            control.deactivate();
        }
        control.activate();
    }
    //添加GPS路径
    function addGps() {
        if (!isGpsRoad) {
            addRoadSelect();
        } else {
            removeRoadSelect();
        }
    }
    //动态控制底部锁的的控件样式
    function controlBottomStyle() {
        var obj = $("#moreBtn");
        var objWidth = obj.width() + 30;
        obj.css("left", $("#fullMapContainer").width() - objWidth);
    }

    //动态控制底部的控件显示
    function hideControlBottom() {
        if (isShowBottomControl) {
            $("#moreControlDiv").animate({ "bottom": "-70px" }, "normal", function () {
                isShowBottomControl = false;
            });
        }
    }

    //加载矢量图层
    function getVectorLayer(name) {
        //定义矢量图层名
        var layerName = "fzfq";

        //如果map已经加载了三个图层，将后来加入的去掉
        if (map.getLayersByName(layerName).length > 0) {
            map.removeLayer(map.getLayersByName(layerName)[0]);
        }
        var gdbps = [];   //请求的GDB  var name = $(this).text();
        var request = new Zondy.Service.HttpRequest();
        var url = "http://192.168.83.187:6163/igs/rest/mrcs/datasource/MapGisLocal/DLDZINFOQUERY/";

        if (name == '防治分区') {
            url = url + "防治分区/sfcls?f=json";
        }
        else if (name == "易发分区") {
            url = url + "易发分区/sfcls?f=json";
        }
        else {
            return;
        }
        request.ajax(url, null, function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].substr(3, 6) == "210211") {
                    gdbps.push("gdbp://MapGisLocal/DLDZINFOQUERY/ds/防治分区/sfcls/" + data[i]);   //将甘井子数据添加到GDBP数组中
                }
            }
            if (gdbps.length > 0) {
                //向服务器请求图层
                var mapVecotor = new Zondy.Map.Layer(layerName, gdbps,
                    {
                        ip: "192.168.83.187",
                        port: "6163",
                        transitionEffect: "resize",
                        singleTile: true,
                        isBaseLayer: false,
                        ration: 1
                    });
                mapVecotor.setOpacity(0.6);
                map.addLayer(mapVecotor);
                map.setLayerIndex(mapVecotor, 1);
                //map.zoomToExtent(
                //    new OpenLayers.Bounds(13434399.205011,4634847.4699733,13654537.8479749,772434.1218287)
                //);
                //var size = map.getSize();
                //var xy = { x: size.w / 2, y: size.h / 2 };
                //map.zoomTo(5, xy);
                map.setCenter(new OpenLayers.LonLat(13532544.35, 4717170.15), 5);
            }
        }, 'get');

    }
    //向路径列表中插入路径选择框
    var isGpsRoad = false;
    var Road = [];
    var Index = 0;
    function addRoadSelect() {
        isGpsRoad = true;
        $("#roadSelect").show();
        $(".roadbox").toggle(
            function () {
                var index = $(".roadbox").index(this);
                if (index == 1) {
                    map.zoomTo(6);
                }
                $(".roadbox").eq(index).css("background-color", "#8272a3");
                if (Road[index]) {
                    Road[index].destroyRoad();
                }
                Index = index;
                lockRoadBox();
                Road[index] = addRoad(index);
                Road[index].runningEndded = unlockRoadBox;
                Road[index].destroyEndded = unlockRoadBox;
                Road[index].start();
            }, function () {
                var index = $(".roadbox").index(this);
                $(".roadbox").eq(index).css("background-color", "#0098ab");
                Index = index;
                Road[index].destroyRoad();
            }
            );
    }
    //加锁按钮屏蔽
    function lockRoadBox() {
        switch (Index) {
            case 0:
                $(".roadboxlock2").show();
                $(".roadboxlock3").show();
                break;
            case 1:
                $(".roadboxlock1").show();
                $(".roadboxlock3").show();
                break;
            case 2:
                $(".roadboxlock1").show();
                $(".roadboxlock2").show();
                break;
            default:
                $(".roadboxlock1").show();
                $(".roadboxlock2").show();
                $(".roadboxlock3").show();
        }
    }
    //解锁按钮屏蔽
    function unlockRoadBox() {
        switch (Index) {
            case 0:
                $(".roadboxlock2").hide();
                $(".roadboxlock3").hide();
                break;
            case 1:
                $(".roadboxlock1").hide();
                $(".roadboxlock3").hide();
                break;
            case 2:
                $(".roadboxlock1").hide();
                $(".roadboxlock2").hide();
                break;
            default:
                $(".roadboxlock1").hide();
                $(".roadboxlock2").hide();
                $(".roadboxlock3").hide();
        }
    }
    //清除路径选择框
    function removeRoadSelect() {
        isGpsRoad = false;
        $(".roadbox").css("background-color", "#0098ab");
        if (Road[0]) Road[0].destroyRoad();
        if (Road[1]) Road[1].destroyRoad();
        if (Road[2]) Road[2].destroyRoad();
        Index = -1;
        unlockRoadBox();
        $("#roadSelect").hide();
    }
    var roadPointData = [];
    roadPointData[0] = [
       { X: 12698465.3, Y: 3499629 }, { X: 12701828.1, Y: 3532650 },
       { X: 12705803.7, Y: 3552829 }, { X: 12712486.9, Y: 3564754 },
       { X: 12722925.7, Y: 3589213 }, { X: 12733626.7, Y: 3610922 },
       { X: 12772150, Y: 3641191 }, { X: 12798750, Y: 3672071 }
    ];

    roadPointData[1] = [
        { X: 12726900.67, Y: 3564448.82 }, { X: 12729346.98, Y: 3571174.39 }, { X: 12730569.22, Y: 3578512.08 }, { X: 12729957.40, Y: 3582793.21 },
        { X: 12726900.58, Y: 3585850.77 }, { X: 12721396.32, Y: 3584016.15 }, { X: 12715893.56, Y: 3582793.34 }, { X: 12711612.18, Y: 3584627.57 },
        { X: 12710389.17, Y: 3571786.06 }, { X: 12717727.28, Y: 3566282.20 }
    ];
    roadPointData[2] = [
        { X: 12717116, Y: 3545797 }, { X: 12734543, Y: 3549772 },
        { X: 12740658, Y: 3556498 }, { X: 12754111, Y: 3563531 },
        { X: 12748608, Y: 3576372 }, { X: 12754417, Y: 3587379 },
        { X: 12755640, Y: 3595940 }, { X: 12755334, Y: 3608170 }
    ];



    var options = [];
    options[0] = { internal: 40, speed: 1000 };
    options[1] = { internal: 50, speed: 300 };
    options[2] = { internal: 40, speed: 600 };

    //在地图上添加路径图层插件
    function addRoad(index) {
        var pointList = [];
        for (var i = 0; i < roadPointData[index].length; i++) {
            var newPoint = new OpenLayers.Geometry.Point(roadPointData[index][i].X, roadPointData[index][i].Y);
            pointList.push(newPoint);
        }
        var Road = new RRteam.Control.DynamicLineVector(map, pointList, options[index]);
        return Road;
    }

})();



