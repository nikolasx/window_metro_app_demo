/// <reference path="jquery-1.7.1.min.js" />
/// <reference path="OpenLayers.js" />

//生成类似百度地图放大缩小时的4个红箭头
OpenLayers.Control.zoomAnimation = OpenLayers.Class(OpenLayers.Control.Navigation, {

    //地图对象
    mapObj: null,

    size: null,
    offset: null,
    //相对HTML文件
    iconBaseUrl: "../images/",

    //放大时右上图标
    topRightIcon: null,
    topRightIconName: "top_r.png",

    //左上
    topLeftIcon: null,
    topLeftIconName: "top_l.png",

    //左下
    downLeftIcon: null,
    downLeftIconName: "down_r.png",

    //右下
    downRightIcon: null,
    downRightIconName: "down_l.png",

    isCenterMouseWheel: true,

    //构造函数
    initialize: function (options) {
        OpenLayers.Control.Navigation.prototype.initialize.apply(this, arguments);
        this.size = new OpenLayers.Size(10, 10);
        this.offset = new OpenLayers.Pixel(-(this.size.w / 2), -(this.size.h / 2));
        this.topRightIcon = new OpenLayers.Icon(this.iconBaseUrl + this.topRightIconName, this.size, this.offset);  //获取marker图标
        this.topLeftIcon = new OpenLayers.Icon(this.iconBaseUrl + this.topLeftIconName, this.size, this.offset);
        this.downRightIcon = new OpenLayers.Icon(this.iconBaseUrl + this.downLeftIconName, this.size, this.offset);
        this.downLeftIcon = new OpenLayers.Icon(this.iconBaseUrl + this.downRightIconName, this.size, this.offset);
    },



    //重写鼠标的滚轮事件
    wheelUp: function (evt) {

        var newZoom = this.map.getZoom();   //获取当前的瓦片级别

        if (newZoom < this.map.getNumZoomLevels() - 1) {
            var markers = new OpenLayers.Layer.Markers("Zoomin", { displayInLayerSwitcher: true });
            //获取鼠标的位置
            var x = evt.xy.x;
            var y = evt.xy.y;

            //marker的初始位置
            var marker1 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x + 7, y + 7)), this.downLeftIcon.clone());
            var marker2 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x - 7, y + 7)), this.downRightIcon.clone());
            var marker3 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x + 7, y - 7)), this.topRightIcon.clone());
            var marker4 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x - 7, y - 7)), this.topLeftIcon.clone());

            marker1.map = this.map;
            marker2.map = this.map;
            marker3.map = this.map;
            marker4.map = this.map;

            markers.addMarker(marker4);
            markers.addMarker(marker3);
            markers.addMarker(marker2);
            markers.addMarker(marker1);

            //将marker作为图层添加到map中
            this.mapObj.addLayer(markers);
            var j = 0;
            var tU;

            //箭头运动
            var movemarkerUp = function (mapObj) {
                marker1.moveTo(new OpenLayers.Pixel(x + 15 * (j + 2), y + 10 * (j + 2)));
                marker2.moveTo(new OpenLayers.Pixel(x - 15 * (j + 2), y + 10 * (j + 2)));
                marker3.moveTo(new OpenLayers.Pixel(x + 15 * (j + 2), y - 10 * (j + 2)));
                marker4.moveTo(new OpenLayers.Pixel(x - 15 * (j + 2), y - 10 * (j + 2)));
                j++;

                if (j == 2) {
                    //移除markers
                    mapObj.removeLayer(markers);
                    markers.clearMarkers()
                    markers.destroy();
                    //销毁计时器
                    window.clearInterval(tU);
                }
            }
            //在计时器事件中this关键字会变化 ，this.mapObj会是未定义
            var mapObj = this.mapObj;

            //设置计时器
            tU = window.setInterval(function () { movemarkerUp(mapObj) }, 210);
        }
        this.wheelChange(evt, 1);
    },


    wheelDown: function (evt) {

        var newZoom = this.map.getZoom();

        if (newZoom > 0) {
            var markers = new OpenLayers.Layer.Markers("Zoomout", { displayInLayerSwitcher: false });
            var x = evt.xy.x;
            var y = evt.xy.y;

            var marker1 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x + 55, y + 40)), this.topLeftIcon.clone()); //左下
            var marker2 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x - 55, y + 40)), this.topRightIcon.clone()); //左上
            var marker3 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x + 55, y - 40)), this.downRightIcon.clone()); //右下
            var marker4 = new OpenLayers.Marker(this.mapObj.getLonLatFromPixel(new OpenLayers.Pixel(x - 55, y - 40)), this.downLeftIcon.clone()); //右上

            marker1.map = this.map;
            marker2.map = this.map;
            marker3.map = this.map;
            marker4.map = this.map;

            markers.addMarker(marker4);
            markers.addMarker(marker2);
            markers.addMarker(marker3);
            markers.addMarker(marker1);
            this.mapObj.addLayer(markers);
            var j = 1;
            var tD;

            var movemarkerDown = function (mapObj) {
                marker1.moveTo(new OpenLayers.Pixel(x + 30 - 15 * (j), y + 15 - 2 * (j)));
                marker2.moveTo(new OpenLayers.Pixel(x - 30 + 15 * (j), y + 15 - 2 * (j)));
                marker3.moveTo(new OpenLayers.Pixel(x + 30 - 15 * (j), y - 15 + 2 * (j)));
                marker4.moveTo(new OpenLayers.Pixel(x - 30 + 15 * (j), y - 15 + 2 * (j)));
                j++;

                if (j == 3) {
                    mapObj.removeLayer(markers);
                    markers.clearMarkers()
                    markers.destroy();
                    window.clearInterval(tD);
                }

            }
            //movemarkerDown();
           
            var mapObj = this.mapObj;
            tD = window.setInterval(function () { movemarkerDown(mapObj) }, 210);
        }
        this.wheelChange(evt, -1);
    },

    //瓦片的切换，实现放大缩小的操作
    wheelChange: function (evt, deltaZ) {
        var currentZoom = this.map.getZoom();
        var newZoom = this.map.getZoom() + Math.round(deltaZ);
        newZoom = Math.max(newZoom, 0);
        newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
        if (newZoom === currentZoom) {
            return;
        }
        var size = this.map.getSize();
        var deltaX = size.w / 2 - evt.xy.x;
        var deltaY = evt.xy.y - size.h / 2;
        var newRes = this.map.baseLayer.getResolutionForZoom(newZoom);
        var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
        var newCenter = new OpenLayers.LonLat(
                            zoomPoint.lon + deltaX * newRes,
                            zoomPoint.lat + deltaY * newRes);
        if (this.isCenterMouseWheel)
            this.map.setCenter(newCenter, newZoom);
        else
            this.map.setCenter(this.map.getCenter(), this.map.getZoom() + Math.round(deltaZ));

    },

    CLASS_NAME: "OpenLayers.Control.zoomAnimation"
});