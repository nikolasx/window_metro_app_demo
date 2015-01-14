/*地图上动态线加载插件*/

//在两点间动态画线
RRteam.Control.DynamicLineVector = OpenLayers.Class({

    internal: 600,
    speed: 10000,
    startPoint: null,
    stopPoint: null,
    currentPoint: null,
    map: null,
    style: null,
    vectorLayer: null,
    pointList: null,
    timer: null,
    markers: null,
    index: null,
    pointCount: null,
    firstMove: true,
    //动画效果执行完后的回调函数
    runningEndded: $.noop,
    destroyEndded: $.noop,

    initialize: function (map, pointList, option) {
        this.map = map;
        this.pointList = pointList;
        this.pointCount = pointList.length;
        this.internal = option.internal;
        this.speed = option.speed;

        //路径线的样式
        var style_green = {
            strokeColor: "red",
            strokeWidth: 3,
            strokeDashstyle: "dashdot",
            pointRadius: 6,
            pointerEvents: "visiblePainted"
        }

        //画线图层设置 
        this.style = OpenLayers.Util.extend({}, style_green);
        this.style.fillOpacity = 0.2;
        this.style.graphicOpacity = 1;

        //加载地图图层vectorLayer和Marks
        this.vectorLayer = new OpenLayers.Layer.Vector("dynamicRoad", { style: this.style });
        this.map.addLayer(this.vectorLayer);
        this.markers = new OpenLayers.Layer.Markers("flag");
        this.map.addLayer(this.markers);
    },


    //初始化后，开始执行函数，加载动态路径
    start: function () {
        this.index = 0;
        this.addMarkByPoint(this.index);
    },

    //在两点之间求得第三点
    getNextPoint: function (point1, point2) {
        var X = point2.x - point1.x;
        var Y = point2.y - point1.y;
        var distance = Math.sqrt(X * X + Y * Y);
        if (distance < this.speed) {
            return new OpenLayers.Geometry.Point(point2.x, point2.y);
        } else {
            var x3 = this.speed * X / distance + point1.x;
            var y3 = this.speed * Y / distance + point1.y;
            return new OpenLayers.Geometry.Point(x3, y3);
        }
    },

    timeFn: function (point1, point2) {
        var newPoint = this.getNextPoint(point1, point2);
        var center = this.map.getCenter();
        var x = this.map.resolution * 600;
        var y = this.map.resolution * 350;
        if (Math.abs(center.lon - newPoint.x) > x || Math.abs(center.lat - newPoint.y) > y) {
            //if (this.firstMove) {
            //    this.map.setCenter(new OpenLayers.LonLat(newPoint.x, newPoint.y));
            //    this.firstMove = false;
            //}
            //this.map.pan(-(point1.x-newPoint.x)*3/this.map.resolution,(point1.y-newPoint.y)*3/this.map.resolution);
            this.map.setCenter(new OpenLayers.LonLat(newPoint.x / 3 + center.lon * 2 / 3, newPoint.y / 3 + center.lat * 2 / 3));
        }
        this.addRoadByPoint(point1, newPoint);
        if (newPoint.x == point2.x && newPoint.y == point2.y) {
            return this.addMarkByPoint(++this.index);
        }
        var that = this;
        this.timer = WinJS.Promise.timeout(this.internal).then(function () {
            that.timeFn(newPoint, point2);
        });
    },
    //在两点之间刻画路径
    addRoadByPoint: function (point1, point2) {
        var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([point1, point2]));
        this.vectorLayer.addFeatures(lineFeature);
    },
    //添加mark点
    addMarkByPoint: function (index) {
        var size = new OpenLayers.Size(25, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 4), -size.h);
        if (index == 0) {
            this.map.setCenter(new OpenLayers.LonLat(this.pointList[0].x, this.pointList[0].y));
        }
        if (index == 0 || index == this.pointCount - 1) {
            var icon = new OpenLayers.Icon('../images/redflag.png', size, offset);
        } else {
            var icon = new OpenLayers.Icon('../images/blueflag.png', size, offset);
        }
        var marker = new OpenLayers.Marker(new OpenLayers.LonLat(this.pointList[index].x, this.pointList[index].y), icon);
        this.markers.addMarker(marker);
        if (index < this.pointCount - 1) {
            this.timeFn(this.pointList[index], this.pointList[index + 1]);
        } else {
            this.runningEndded.call(this.runningEndded);
        }
    },
    //清楚gps路径
    destroyRoad: function () {
        if (this.timer) {
            this.timer.cancel();
            this.destroyEndded.call(this.destroyEndded);
        }
        this.vectorLayer.destroy();
        this.markers.destroy();
    },
    CLASS_NAME: "RRteam.Control.DynamicLineVector"
});