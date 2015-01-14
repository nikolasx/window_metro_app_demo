﻿
var areaArr = [];//存放绘画范围要素的数组
var searchResultArr = [];//存放查询结果的数组
var pointLayer = new OpenLayers.Layer.Vector("points_layer");   //点图层
var formerPointArr = [];//上一次查询到的灾害点,下一次查询的时候清除所有的点
var resultPointFeatureArr = [];//生成的点要素，（因为即时搜索时，需要用到）
var lastPointer = [];
var searchArray = [];
var ele;


(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/zhInfoQuery.html", {
        ready: function (element, options) {
            intQueryMap();
            getCheckBox();
            initFunction();
            initQAppBar(); //初始化Appbar;
        },
        unload: function () {
            AppBarSampleUtils.removeAppBars();
        }
    });

    //加载地图
    function intQueryMap() {
        //判断当前是否本地地图  fileState（全局变量）为1 表示已经下载 ；3为未下载
        if (fileState == 3) {
            //用一个图片替代地图
            $("#lockQueryMap").css({ 'background': 'url(../images/queryMap.jpg) 0 0 no-repeat', 'opacity': '1' });
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

        window.queryMap = new OpenLayers.Map("queryMap", {
            maxExtent: new OpenLayers.Bounds(13149614.85, 4383204.95, 13775786.99, 5009377.09),
            controls: [nav],
            numZoomLevels: 7,
            maxResolution: 2445.984921875,
            theme: null
        });

        //定义瓦片图层
        var titleLayerAppQ = new Zondy.Map.TileLayerForMetro("myAppDitu", "", {
                baseUrl: "ms-appdata:///local/map/IMG"
            }
        );
        ////定义瓦片图层
        //var titleLayerQ = new Zondy.Map.TileLayer("ditu", "DaLianAll", {
        //    ip: '192.168.83.187',
        //    port: '6163',
        //    transitionEffect: 'resize'
        //});

        //定义矢量图层
        window.boxLayer = new OpenLayers.Layer.Vector("Box_layer");
        //添加图层
        queryMap.addLayers([titleLayerAppQ, boxLayer]);
        //boxLayer.addFeatures(
        //定义绘画模式
        window.drawControls = {
            //拉框
            drawControlRegularPolygo: new OpenLayers.Control.DrawFeature(boxLayer, OpenLayers.Handler.RegularPolygon, {
                handlerOptions: {
                    sides: 4,
                    irregular: true
                }
            }),
            //画圆
            drawControlCircle: new OpenLayers.Control.DrawFeature(boxLayer, OpenLayers.Handler.RegularPolygon, {
                handlerOptions: {
                    sides: 100,
                    irregular: false
                }
            }),
        };

        //绘画模式 添加到Map
        for (var index in drawControls) {
            queryMap.addControl(drawControls[index]);
        }

        //地图初始中心
        /*地图初始中心 ,区分是否有本地地图的原因是
        *当有时，直接定位到3级;
        * 没有时，下载完地图时会重新设定中心也是3级，但是当前视口的瓦片会不可见，用这个方法解决
        */
        if (fileState == 3) {
            queryMap.setCenter(new OpenLayers.LonLat(13532544.35, 4717170.15), 2);
        }
        else if (fileState == 1) {
            queryMap.setCenter(new OpenLayers.LonLat(13532544.35, 4717170.15), 3);
        }
        nav.activate();

        ////查询结果拖拽翻页，放在这里是为了解决反复查询后，翻页事件多次注册的问题

    }

    //创建 win8风格的checkBox
    function getCheckBox() {
        var data = ["甘井子街道", "南关岭街道", "机场街道", "红旗街道", "革镇堡街道", "营城子街道", "兴华街道", "泉水街道", "辛寨子街道", "周水子街道", "椒金山街道", "椒山街道"];
        var dataArray = packageData(data);
        window.checkBox = new Rrteam.Control.CheckDivBox("streetContent", "rr1",
        {
            width: 158,
            height: 50,
            nums: 2,
            dataArray: dataArray,
            isAllSelectBotton: true
        });
        var data2 = ["危险斜坡", "滑坡", "崩塌", "泥石流", "地裂缝", "地面塌陷", "地面沉降"];
        var dataArray2 = packageData(data2);
        window.checkBox2 = new Rrteam.Control.CheckDivBox("disasterType", "rr2",
        {
            width: 158,
            height: 50,
            nums: 2,
            dataArray: dataArray2,
            isAllSelectBotton: true
        });
        $(".changeCartTitleIte").click(
            function () {
                var selected = $(this);
                var index = $(".changeCartTitleItems").index(selected);
                $(".changeCartContent").eq(index).fadeIn("slow");
                $(".changeCartContent").eq(index).siblings().hide();
                $(".changeCartTitleItems").eq(index).removeClass("changeCartTitleSelec");
                $(".changeCartTitleItems").eq(index).siblings().addClass("changeCartTitleSelec");
            }
            );
    }

    function packageData(data) {
        var dataArray = [];
        for (var i = 0; i < data.length; i++) {
            var str = '<div style="position:relative;text-align:center;top:-10px;color:white;font-size:large;font-weight:bolder;">' +
                            data[i] +
                      '</div>';
            dataArray.push(str);
        }
        return dataArray;
    }

    //锁屏
    function initQAppBar() {
        //锁屏控制
        var btnLinks = document.getElementById("btnLocQMap").winControl;
        btnLinks.addEventListener("click", function (evt) {
            //尚未下载本地地图
            if (fileState == 3) {
                var md = new Windows.UI.Popups.MessageDialog('未下载系统底图数据，请到系统设置页面下载系统底图数据。', '提示');
                //显示弹出框
                md.showAsync();
            }
            else {
                var obj = $(this);
                if (lockState) {
                    //更改锁屏div的背景和的、透明度
                    $("#lockDiv").css({ 'background': '', 'opacity': '0' });

                    //更换锁的样式
                    btnLinks.icon = "url(images/mapMoreControls/unlocked.png)";
                    $("#lockQueryMap").css("visibility", "visible");
                    $("#lockQueryMap").css("width", "1300px");
                    lockState = false;

                    //恢复滚动
                    $(".pagezoom-view").css("overflow-x", "auto");
                }
                else {
                    btnLinks.icon = "url(images/mapMoreControls/locked.png)";
                    $("#lockQueryMap").css("visibility", "hidden");
                    lockState = true;

                    //不能滚动，只能操作地图
                    $(".pagezoom-view").css("overflow-x", "hidden");

                }
            }

        }, false);
    }

    function initFunction() {

        //动态控制地图遮住面板的高和位置
        var tempHeight = $("#queryMap").css("height").split('p')[0];
        $("#lockQueryMap").css({ "top": parseInt(-tempHeight - 7) + "px", "height": parseInt(tempHeight) + 15 + "px" })

        //查询结果拖拽翻页，放在这里是为了解决反复查询后，翻页事件多次注册的问题
        search();

        //从indexeddb中获取数据
        getDatas(7);

        //绘画点击事件注册
        $(".drawTypeItem").live("click", function () {
            drawTypeControl(this, "");
        });
        //查询点击事件
        queryMap.addLayer(pointLayer);
        $("#queryDisInfo").click(function () {
            //获得选择的街道
            var streetArr = getStreetArr();
            //获得选择的灾害类型
            var typeArr = getTypeArr();
            //获得当前是否绘画区域，并得到绘画类型
            var drwaType = $(".drawTypeSelected").attr("id");
            //得到符合条件的灾害点信息
            searchResultArr = selectDisasterInfo(drwaType, streetArr, typeArr);
            showSearchResult(searchResultArr);
        });

    }


    var isHasFormer = false;
    //绘画选择事件
    function drawTypeControl(obj, drawType) {
        if ($(obj).hasClass("drawTypeSelected")) {
            return;
        }
        else {
            $(".drawTypeItem").removeClass("drawTypeSelected");
            $(obj).addClass("drawTypeSelected");
        }
        if (drawType == "") {
            var drawType = $(obj).attr("id");
        }
        if (drawType == "noneDrawType") {
            boxLayer.removeFeatures(boxLayer.features[0]);
            isHasFormer = false;
        }
        for (var key in drawControls) {
            var control = drawControls[key];
            if (drawType == key) {
                control.featureAdded = function (evt) {
                    deleteFormer(evt, drawType);
                }
                control.activate();
            } else {
                control.deactivate();
            }
        }
    }

    //添加要素后的回调函数
    function deleteFormer(evt, drawType) {
        areaArr.length = 0;
        if (isHasFormer) {
            //移除前一个
            evt.layer.removeFeatures(evt.layer.features[0]);
        }
        else {
            isHasFormer = true;
        }
        var x_max = evt.layer.features[0].geometry.bounds.top;
        var x_min = evt.layer.features[0].geometry.bounds.bottom;
        var y_max = evt.layer.features[0].geometry.bounds.right;
        var y_min = evt.layer.features[0].geometry.bounds.left;
        if (drawType == "drawControlCircle") {
            areaArr.push(evt.layer.features[0].geometry.bounds.getCenterLonLat().lon);
            areaArr.push(evt.layer.features[0].geometry.bounds.getCenterLonLat().lat);
            areaArr.push((x_max - x_min) / 2);
        } else {
            areaArr.push(x_max);
            areaArr.push(x_min);
            areaArr.push(y_max);
            areaArr.push(y_min);
        }
    }

    //获取indexeddb中的数据

    function getDatas(currentIndex) {
        getDataCount(function (values) {
            var count = values;
            for (var i = 1 ; i <= count; i++) {
                getSpecifyedDataByKey(i, function (values) {
                    var d = values;
                    var lon = d.经度;
                    var lat = d.纬度;
                    var lon2 = transform(lon);
                    var lat2 = transform(lat);
                    var mokatuolon = LonToMetersGCXZ(lon2);
                    var mokatuolat = LatToMetersGCXZ(lat2);
                    var obj = {
                        "objId": d.ID,
                        "lon": mokatuolon,
                        "lat": mokatuolat,
                        "name": d.名称,
                        "bianhao": d.统一编号,
                        "disType": d.灾害类型,
                        "pop": d.威胁人口,
                        "state": d.目前稳定状态,
                        "street": d.街道,
                        "xianming": d.县名
                    };
                    disArr.push(obj);
                });
            }
        });
    }

    //将经纬度转换成度分秒形式
    function transform(num) {
        var du = num.substring(0, num.length - 4);
        var fen = parseInt(num.substring(num.length - 4, num.length - 2));
        var miao = parseInt(num.substring(num.length - 2, num.length));
        var fen2 = fen / 60;
        var miao2 = miao / 3600;
        return Number(du) + Number(fen2) + Number(miao2);
    }

    var originShiftGCXZ = 2 * Math.PI * 6378137 / 2.0;
    //将经纬度转换成墨卡托直角坐标
    function LonToMetersGCXZ(lon) {
        return lon * originShiftGCXZ / 180.0;
    }
    function LatToMetersGCXZ(lat) {
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
        return y * originShiftGCXZ / 180.0;
    }

    // 得到 选择的 街道
    function getStreetArr() {
        var resultIndex = checkBox.getSelectIndex();
        var data = ["全选", "甘井子街道", "南关岭街道", "机场街道", "红旗街道", "革镇堡街道", "营城子街道", "兴华街道", "泉水街道", "辛寨子街道", "周水子街道", "椒金山街道", "椒山街道"];
        var streetArr = [];
        for (var i = 0; i < resultIndex.length; i++) {
            streetArr.push(data[resultIndex[i]]);
        }
        return streetArr;
    }

    // 得到 选择的 灾害类型
    function getTypeArr() {
        var resultIndex = checkBox2.getSelectIndex();
        var data2 = ["全选", "危险斜坡", "滑坡", "崩塌", "泥石流", "地裂缝", "地面塌陷", "地面沉降"];
        var disasterTypeArr = [];
        for (var i = 0; i < resultIndex.length; i++) {
            disasterTypeArr.push(data2[resultIndex[i]]);
        }
        return disasterTypeArr;
    }

    //选出要显示的灾害点
    function selectDisasterInfo(drawType, streetArr, typeArr) {
        var tempArr_stree = [];//街道符合的临时数组
        var tempArr_type = [];//灾害类型符合的临时数组
        var showArr = [];         //要显示的灾害点数组

        //选出街道符合的灾害点
        for (var i = 0; i < streetArr.length; i++) {
            for (var j = 0; j < disArr.length; j++) {
                if (disArr[j].street == streetArr[i]) {
                    tempArr_stree.push(disArr[j]);
                }
            }
        }

        //选出灾害类型符合的灾害点
        for (var i = 0; i < typeArr.length; i++) {
            for (var j = 0; j < tempArr_stree.length; j++) {
                if (tempArr_stree[j].disType == typeArr[i]) {
                    tempArr_type.push(tempArr_stree[j]);
                }
            }
        }

        //选出范围符合的灾害点
        for (var i = 0; i < tempArr_type.length; i++) {
            if (drawType == "drawControlRegularPolygo") {
                if (tempArr_type[i].lat < areaArr[0] && tempArr_type[i].lat > areaArr[1] && tempArr_type[i].lon < areaArr[2] && tempArr_type[i].lon > areaArr[3]) {
                    showArr.push(tempArr_type[i]);
                }
            }
            else if (drawType == "drawControlCircle") {
                var pointsLenght = Math.pow(tempArr_type[i].lon - areaArr[0], 2) + Math.pow(tempArr_type[i].lat - areaArr[1], 2);
                pointsLenght = Math.sqrt(pointsLenght);
                if (pointsLenght < areaArr[2]) {
                    showArr.push(tempArr_type[i]);
                }
            }
            else {
                showArr = tempArr_type;
            }
        }
        return showArr;
    }

    //显示查询结果
    function showSearchResult(array) {
        for (var i = 0; i < formerPointArr.length; i++) {
            pointLayer.removeFeatures(formerPointArr[i]);
        }
        var searchResultArr2 = paixuByBianhao(array);
        resultPointFeatureArr = [];
        //不同灾害类型用不同的颜色表示
        var arrColor = [];
        queryMap.setCenter(new OpenLayers.LonLat(13532544.35, 4717170.15), 3);
        //if (searchResultArr2.length > 0) {
        //    if (searchResultArr2.length >= 4) {
        //        for (var i = 0; i < 4; i++) {
        //            var color = getCorlorByDisType(searchResultArr2[i].disType);
        //            addPointsToLayerByType(searchResultArr2[i].lon, searchResultArr2[i].lat, color);
        //        }
        //    } else {
        //        for (var i = 0; i < searchResultArr2.length; i++) {
        //            var color = getCorlorByDisType(searchResultArr2[i].disType);
        //            addPointsToLayerByType(searchResultArr2[i].lon, searchResultArr2[i].lat, color);
        //        }
        //    }
        //    for (var i = 0; i < searchResultArr2.length; i++) {
        //        var color = getCorlorByDisType(searchResultArr2[i].disType);
        //        var colorInf = { name: searchResultArr2[i].disType, color: color }
        //        arrColor.push(colorInf);
        //    }
        //    //将图形删除
        //    boxLayer.removeFeatures(boxLayer.features[0]);
        //    isHasFormer = false;

        //    //取消绘画
        //    drawTypeControl($(".noneDrawType"), "noneDrawType");
        //    //生成详细信息蒙板
        //    initResultMengban(searchResultArr2, arrColor);
        //} else {
        //    $("#count").html("<font style='color:#EA7603;'>0</font>/0条");
        //}
        for (var i = 0; i < searchResultArr2.length; i++) {
            var color = getCorlorByDisType(searchResultArr2[i].disType);
            addPointsToLayerByType(searchResultArr2[i].lon, searchResultArr2[i].lat, color);
            arrColor.push(color);
        }
        //将图形删除
        boxLayer.removeFeatures(boxLayer.features[0]);
        isHasFormer = false;

        //取消绘画
        drawTypeControl($(".noneDrawType"), "noneDrawType");
        //生成详细信息蒙板
        initResultMengban(searchResultArr2, arrColor);
    }


    //按照编号排列
    function paixuByBianhao(array) {
        for (var i = 0; i < array.length; i++) {
            for (var j = i + 1; j < array.length; j++) {
                var c;
                if (parseInt(array[i].bianhao) > parseInt(array[j].bianhao)) {
                    c = array[i];
                    array[i] = array[j];
                    array[j] = c;
                }
            }
        }
        return array;
    }

    /*在地图上显示灾害信息点*/
    function addPointsToLayerByType(lon, lat, color) {
        var pointObj = new OpenLayers.Geometry.Point(lon, lat);

        //统一定义全部灾害点的样式
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 1;
        layer_style.graphicOpacity = 1;
        //pointstyle
        var point_blue = OpenLayers.Util.extend({}, layer_style);
        point_blue.strokeColor = "#000000";
        point_blue.fillColor = color;
        point_blue.graphicName = "circle";
        point_blue.pointRadius = 8;
        point_blue.strokeWidth = 1.5;

        //定义一个点要素
        var pointFeature = new OpenLayers.Feature.Vector(pointObj, null, point_blue);

        //将灾害点添加到结果数组，即时搜索中使用
        resultPointFeatureArr.push(pointFeature);

        //添加到相应 的图层
        pointLayer.addFeatures(pointFeature);

        //将本次添加到数组中 
        formerPointArr.push(pointFeature);

    }

    /*根据灾害类型获得颜色*/
    function getCorlorByDisType(disType) {
        var color = "";
        switch (disType) {
            case "危险斜坡":
                color = "#009CAE";
                break;
            case "崩塌":
                color = "#613CBC";
                break;
            case "泥石流":
                color = "#FFDC61";
                break;
            case "地裂缝":
                color = "#00A200";
                break;
            case "滑坡":
                color = "#FF1800";
                break;
            case "地面沉降":
                color = "#1E74DD";
                break;
            case "地面塌陷":
                color = "#FF7200";
                break;
            default:
                break;
        }
        return color;
    }
    var currentPage = 1;
    var pages;
    //显示蒙版信息
    function initResultMengban(array, arrColor) {
        $("#choice").hide();
        $("#mengban").show();
        var disasterData;
        var color;
        var count = array.length;
        $("#count").html("<font style='color:#EA7603;'>" + count + "</font>/" + count + "条");
        var myData = new WinJS.Binding.List();
        for (var i = 0; i < array.length; i++) {
            disasterData = array[i];
            color = arrColor[i];
            var data = {
                disType: disasterData.disType, pop: disasterData.pop, state: disasterData.state,
                xianming: disasterData.xianming, bianhao: disasterData.bianhao, color: color,
                lon: disasterData.lon, lat: disasterData.lat
            }
            myData.push(data);
        }
        var listView = document.getElementById("listView").winControl;
        listView.itemDataSource = myData.dataSource;
        lastPointer = [];
        select();
        backToCheck();
    }

    function select() {
        var listView = document.querySelector("#listView").winControl;
        listView.forceLayout();

        // Register the selection changed event
        listView.addEventListener("selectionchanged", selectionChangedHandler, false);

        function selectionChangedHandler() {

            // Check for selection
            var selectionCount = listView.selection.count();
            if (selectionCount === 1) {

                // Only one item is selected, show the message
                // information for the item
                listView.selection.getItems().done(function (items) {

                    // Print item data to the relevant message pane locations
                    var lon = items[0].data.lon;
                    var lat = items[0].data.lat;
                    var disType = items[0].data.disType;
                    queryMap.setCenter(new OpenLayers.LonLat(lon, lat), 5);
                    //还原上一个被点击的pointer到默认颜色
                    if (lastPointer.length > 0) {
                        sharingPointer(lastPointer[0], lastPointer[1], lastPointer[2]);
                    }
                    //记录当前被点击的Pointer的信息，下次点击时还原上一次点击的Pointer
                    var color = getCorlorByDisType(disType);
                    lastPointer = [lon, lat, color];
                    sharingPointer(lon, lat, "red");
                });

            } else {

                // If none or multiple items are selected, clear the view

            }
        }


    }


    //搜索
    function search() {
        $("#input").focusout(function () {
            var searchKeyWord = $("#input").val();
            if (searchKeyWord != "") {
                var showArr = [];  //即时搜索获得的灾害点信息数组
                var re = new RegExp(searchKeyWord);   //正则表达式
                for (var i = 0; i < searchResultArr.length; i++) {
                    var tempArrType, tempArrBianhao, tempArrName;  //正则匹配后的返回值(灾害类型，编号，名称3种搜索方式)
                    /*
                    var s = "The ainr in Spain falls mainly in the plain";
                    re = /ain/ig;      // 创建正则表达式模式。
                    r = s.match(re);   // 尝试去匹配搜索字符串。
                    return(r);         // 返回的数组包含了所有 "ain" 
                    */
                    tempArrType = searchResultArr[i].disType.match(re);
                    tempArrBianhao = searchResultArr[i].bianhao.match(re);
                    tempArrName = searchResultArr[i].name.match(re);
                    if (tempArrType && tempArrType.index == 0 || tempArrBianhao && tempArrBianhao.index == 0 || tempArrName && tempArrName.index == 0) {  //是否下标为0
                        showArr.push(searchResultArr[i]);
                    }
                }
                searchArray = showArr;
                showSearchResult(searchArray);   //每次搜索结束后，更像全局变量 showSearchResult;
            } else {
                showSearchResult(searchResultArr);  //全部灾害点信息重新加载，包括蒙板
            }
            lastPointer = [];
        });
    }



    //返回上一级
    function backToCheck() {
        $("#back").click(
            function () {
                $("#mengban").hide();
                $("#choice").show();
                $("#noneDrawType").addClass("drawTypeSelected");
                $("#input").val("");
            });
    }
    //点击蒙板中的某一项数据

    function mengbanSelect(array, arrColor) {
        $(".disasterShowInf").click(function () {
            var index = $(".disasterShowInf").index($(this));
            $(".disasterShowInf").eq(index).removeClass("disasterUnSelected").addClass("disasterSelected");
            var selected = $(".right_top_img_Selected");
            selected.removeClass("right_top_img_Selected");
            $(".right_top").eq(index).addClass("right_top_img_Selected");
            $(".disasterShowInf").eq(index).siblings().removeClass("disasterSelected").addClass("disasterUnSelected");

        });
    }
    //闪烁点
    function sharingPointer(lon, lat, color) {
        var pointObj = new OpenLayers.Geometry.Point(lon, lat);

        //统一定义全部灾害点的样式
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 1;
        layer_style.graphicOpacity = 1;
        //pointstyle
        var point_blue = OpenLayers.Util.extend({}, layer_style);
        point_blue.strokeColor = "#000000";
        point_blue.fillColor = color;
        point_blue.graphicName = "circle";
        point_blue.pointRadius = 8;
        point_blue.strokeWidth = 1.5;

        //定义一个点要素
        var pointFeature = new OpenLayers.Feature.Vector(pointObj, null, point_blue);

        //添加到相应 的图层
        formerPointArr.push(pointFeature);
        pointLayer.addFeatures(pointFeature);
    }
})();