
/*在两点间，连一条路径线*/
/*采用随机方式，两点间添2个随机点*/
var RRteam = {};
RRteam.Control = {};

RRteam.Control.addLine = OpenLayers.Class({
    pointCount: 3, //两点间的段数
    currentPointCount: 0, //当前点序号
    lineLayer: null, // 画线图层
    currentPoint: null,
    pianyi: 0, //偏移直线的度

    xLength: 0,//两点间X差
    yLength: 0,//两点间Y差

    point1: null,  //起点
    point2: null,  //终点

    paceLength: 800,
    state: 0,  //当前状态，0为平，1为上拐，2为下拐


    initialize: function (point1, point2, layer, options) {
        this.point1 = point1;
        this.point2 = point2;
        var option = OpenLayers.Util.extend(this, options);
        this.xLength = point2.x - point1.x;
        this.yLength = point2.y - point1.y;
        this.currentPoint = point1;
        this.lineLayer = layer;
        this.currentPointCount = 0;
        this.state = 0;
        this.draw();
    },

    //画线操作
    draw: function () {
        while (this.currentPointCount < this.pointCount) {
            var point = this.getNextPoint();
            var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([this.currentPoint, point]));
            this.lineLayer.addFeatures(lineFeature);
            this.currentPoint = point;
            this.currentPointCount++;
        }
    },

    //获取下一个点
    getNextPoint: function () {
        var x, y;
        x = this.currentPoint.x + this.xLength / this.pointCount;
        //若当前点为到达的前一个点
        if (this.currentPointCount == this.pointCount - 1) {
            return this.point2;
        }

        if (this.pointCount - this.currentPointCount < this.pianyi) {
            y = this.currentPoint.y + this.yLength / this.pointCount - this.paceLength;
            return new OpenLayers.Geometry.Point(x, y);
        }

        if (this.pianyi < 0 && this.pointCount - this.currentPointCount < -this.pianyi) {
            y = this.currentPoint.y + this.yLength / this.pointCount + this.paceLength;
            return new OpenLayers.Geometry.Point(x, y);
        }


        if (this.state == 0) {
            var random = Math.random();
            if (random < 0.35) {
                y = this.currentPoint.y + this.yLength / this.pointCount - this.paceLength;
                this.pianyi--;
                this.state = 2;
                return new OpenLayers.Geometry.Point(x, y);
            } else if (random >= 0.35 && random < 0.65) {
                y = this.currentPoint.y + this.yLength / this.pointCount;
                this.state = 0;
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                y = this.currentPoint.y + this.yLength / this.pointCount + this.paceLength;
                this.pianyi++;
                this.state = 1;
                return new OpenLayers.Geometry.Point(x, y);
            }
        } else if (this.state == 1) {
            var random = Math.random();
            if (random < 0.5) {
                y = this.currentPoint.y + this.yLength / this.pointCount;
                this.state = 0;
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                y = this.currentPoint.y + this.yLength / this.pointCount + this.paceLength;
                this.pianyi++;
                this.state = 1;
                return new OpenLayers.Geometry.Point(x, y);
            }
        } else {
            var random = Math.random();
            if (random < 0.5) {
                y = this.currentPoint.y + this.yLength / this.pointCount;
                this.state = 0;
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                y = this.currentPoint.y + this.yLength / this.pointCount - this.paceLength;
                this.pianyi--;
                this.state = 2;
                return new OpenLayers.Geometry.Point(x, y);
            }
        }

    },
    CLASS_NAME: "RRteam.Control.addLine"
});