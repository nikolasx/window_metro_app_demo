
//定义全局变量查询一次灾害数据
var StatisticsData = null;
(function () {
    "use strict";
    WinJS.UI.Pages.define("/html/disasterInfoStatistics/disasterInfoStatistics.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            appBar.disabled = true;
            disasterTitleColorChange();
            WinJS.Promise.timeout(300).then(function () {
                getStatisData();
            });
            backClick();
        },
        unload: function () {
        }
    });
    //返回注册事件
    function backClick() {
        $("#statisback").click(function () {
            //WinJS.Navigation.back();
            appBar.disabled = false;
            $("#secondClassPages").css("width", "0");
            $("#initPage").css("width", "100%");
        });
    }
    //标题颜色联动方法
    function disasterTitleColorChange() {
        $(".statisheadtitle").eq(0).addClass("statisheadtitle_hover");
        $(".statisheadtitle").click(function () {
            $(".statisheadtitle").removeClass("statisheadtitle_hover");
            var index = $(".statisheadtitle").index(this);
            $(".statisheadtitle").eq(index).addClass("statisheadtitle_hover");
            $("#statiscontainer").scrollLeft(index * 1366);
        });
        $("#statiscontainer").scroll(function () {
            var length = $("#statiscontainer").scrollLeft();
            if (length < 1200) {
                $(".statisheadtitle").removeClass("statisheadtitle_hover");
                $(".statisheadtitle").eq(0).addClass("statisheadtitle_hover");
            }
            else if (length >= 1200 && length < 2566) {
                $(".statisheadtitle").removeClass("statisheadtitle_hover");
                $(".statisheadtitle").eq(1).addClass("statisheadtitle_hover");
            } else {
                $(".statisheadtitle").removeClass("statisheadtitle_hover");
                $(".statisheadtitle").eq(2).addClass("statisheadtitle_hover");
            }
        });
    }
    //获取统计数据
    function getStatisData() {
        if (StatisticsData == null) {
            getDisasterClass(function (values) {
                StatisticsData = values;
                if (values) {
                    statisColumn.init(StatisticsData);
                    var data = anaysisData(StatisticsData);
                    statisPie.init(data);
                    addBar(data);
                }
            });
        } else {
            statisColumn.init(StatisticsData);
            var data = anaysisData(StatisticsData);
            statisPie.init(data);
            addBar(data);
        }
    }
    //*********************************插入柱状图***********************************************//
    //解析得到的数据
    function anaysisData(data) {
        var ans = new Array(7);
        for (var i = 0; i < ans.length; i++) {
            ans[i] = new Array(12);
            for (var j = 0; j < ans[i].length; j++) {
                ans[i][j] = 0;
            }
        }
        for (var i = 0; i < data.length; i++) {
            switch (data[i].灾害类型) {
                case "崩塌":
                    ans[0][0]++;
                    ans[0][getX(data[i].街道)]++;
                    break;
                case "滑坡":
                    ans[1][0]++;
                    ans[1][getX(data[i].街道)]++;
                    break;
                case "泥石流":
                    ans[2][0]++;
                    ans[2][getX(data[i].街道)]++;
                    break;
                case "地裂缝":
                    ans[3][0]++;
                    ans[3][getX(data[i].街道)]++;
                    break;
                case "危险斜坡":
                    ans[4][0]++;
                    ans[4][getX(data[i].街道)]++;
                    break;
                case "地面塌陷":
                    ans[5][0]++;
                    ans[5][getX(data[i].街道)]++;
                    break;
                case "地面沉降":
                    ans[6][0]++;
                    ans[6][getX(data[i].街道)]++;
                    break;
                default:
            }
        }
        return ans;
        //根据灾害点街道获取数据坐标
        function getX(street) {
            switch (street) {
                case "甘井子街道":
                    return 1;
                case "南关岭街道":
                    return 2;
                case "机场街道":
                    return 3;
                case "红旗街道":
                    return 4;
                case "革镇堡街道":
                    return 5;
                case "营城子街道":
                    return 6;
                case "兴华街道":
                    return 7;
                case "泉水街道":
                    return 8;
                case "辛寨子街道":
                    return 9;
                case "周水子街道":
                    return 10;
                default:
                    return 11;
            }
        }
    }
    
    var statisColumn = {
        //入口初始化函数
        init: function (data) {
            var columndata = anaysisData(data);
            if (this.getData(columndata)) {
                this.addColumn();
            }
        },
        colors: ["#0b8496", "#488de1", "#0b8496", "#492796", "#143471", "#065e95", "#488de1"],
        //更改data属性
        getData: function (columndata) {
            this.data = [];
            var that = this;
            for (var i = 0; i < columndata.length; i++) {
                var d = {
                    y: columndata[i][0],
                    color: that.colors[i],
                    drilldown: {
                        name: this.categories[i],
                        categories: ["甘井子街道", "南关岭街道", "机场街道", "红旗街道", "革镇堡街道", "营城子街道", "兴华街道", "泉水街道", "辛寨子街道", "周水子街道"],
                        data: columndata[i].slice(1,10),
                        color: that.colors[i]
                    }
                };
                this.data.push(d);
            }
            return true;
        },
        
       
        categories : ['崩塌', '滑坡', '泥石流', '地裂缝', '危险斜坡','地面塌陷','地面沉降'],
        name : '灾害类型',
        data : [],
        setChart:function(chart,name, categories, data, color) {
            chart.xAxis[0].setCategories(categories);
            chart.series[0].remove();
            chart.addSeries({
                name: name,
                data: data,
                color: color || 'white'
            });
        },
     
        //添加柱状图
        addColumn: function () {
            var that = this;
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'statiscolumn',
                    type: 'column',
                    backgroundColor:"#171c22"
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: that.categories,
                    labels: {
                        style: {
                            fontSize: "12px",
                            color: "#898f97",
                            lineHeight:"20px"
                        }
                    }
                },
                yAxis: {
                    allowDecimals:false,
                    title: {
                        text: ''
                    },
                    gridLineColor:'#313C47'
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',
                        borderColor:"#171c22",
                        point: {
                            events: {
                                click: function() {
                                    var drilldown = this.drilldown;
                                    if (drilldown) { // drill down
                                        that.setChart(chart, drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                                    } else { // restore
                                        that.setChart(chart,that.name, that.categories, that.data);
                                    }
                                }
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            color: "#898f97",
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function() {
                                return this.y +'处';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var point = this.point,
                            s = this.x +':<b>'+ this.y +'处</b>';
                            return s;
                    }
                },
                series: [{
                    name: that.name,
                    data: that.data,
                    //color: 'white'
                }],
                exporting: {
                    enabled: false
                }
            });
        }
    }
    
    //*********************************插入饼图***********************************************//
    var statisPie = {
        //初始化入口函数
        init: function (data) {
            this.addPie(data);
            this.addListData(data);
            this.addBoxData(data, 2);
            this.addListAward(2);
        },
        
        addPie: function (data) {
            addListClick();
     var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'statispie',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: "#171c22",
        },
        title: {
            text: ''
        },
        tooltip: {
            //formatter: function() {
            //    return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
            //}
        },
        colors: [
              "#492796",
              "#488de1",
              "#0b8496",
              "#48b8e1",
              "#143471",
              "#065e95"
        ],
            
        plotOptions: {
            // startAngle:180,
            pie: {
                allowPointSelect: true,
                animation:false,
                size: "450",
                borderColor:"#171c22",
                //innerSize:"200",
                cursor: 'pointer',
                startAngle: 180,
                events: {
                    click: function (evt) {
                        var index = getDisX(evt.point.name);
                        statisPie.addBoxData(data, index);
                        statisPie.addListAward(index);
                    }
                },
                dataLabels: {
                    enabled: false,
                    color: '#171c22',
                    connectorColor: '#171c22'
                },
            },
        },
        series: [{
            type: 'pie',
            name: '灾害类型',
            data: getSeries(data)
        }]
     });
            //根据灾害类型，获取类型下标
     function getDisX(disName) {
         switch (disName) {
             case "崩塌":
                 return 0;
             case "滑坡":
                 return 1;
             case "泥石流":
                 return 2;
             case "地裂缝":
                 return 3;
             case "危险斜坡":
                 return 4;
             case "地面塌陷":
                 return 5;
             case "地面沉降":
                 return 6;
             default:
                 return 7;

         }
     }
    //获得series数据
    function getSeries(data) {
        return [
            ["崩塌",data[0][0]],
            ["滑坡",data[1][0]],
            { name: "泥石流", y: data[2][0], sliced: true, selected: true },
            ["地裂缝",data[3][0]],
            {name:"危险斜坡", y:data[4][0],legendIndex:0},
            ["地面塌陷", data[5][0]],
            ["地面沉降", data[6][0]]
        ];
    }
            //点击列表触发饼图点击事件
            //注册列表点击事件
            function addListClick() {
                $("#statispieList > li").click(function () {
                    var index = $("#statispieList > li").index(this);
                    statisPie.addListAward(index);
                    statisPie.addBoxData(data, index);
                });
            }
        },
        //向列表中插入数据
        addListData:function(data) {
        for (var i = 0; i < data.length; i++) {
            $(".statisLidisCount").eq(i).html(data[i][0]+"处");
        }
        },
        //向列表框中插入数据
        addBoxData: function (data, index) {
            $("#statispieBox").stop().animate({"margin-top":50+index*44+"px"},"slow");
            for (var i = 1; i <= 10; i++) {
                $(".statisPieStreetCount").eq(i).html(data[index][i]+"处");
            }
        },
        //在列表上添加选中箭头
        addListAward: function (index) {
            $("#statispieList > li").css("background", "url(../../images/22.png) no-repeat");
            $("#statispieList > li").eq(index).css("background", "url(../../images/11.png) no-repeat");
        },
       

}
    /*********************************添加条形图*************************************/
    function addBar(data) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'statisbar',
                type: 'bar',
                backgroundColor:"#171c22",
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['崩塌', '滑坡', '泥石流', '地裂缝', '危险斜坡','地面塌陷','地面沉降'],
                title: {
                    text: null
                },
                labels: {
                      style: {
                      fontSize: "12px",
                      color: "#898f97",
                    }
                }
            },
            yAxis: {
                min: 0,
                gridLineWidth:0,
                title: {
                    text: '',
                    align: 'high'
                }
            },
            tooltip: {
                borderColor:"#000000",
                formatter: function() {
                    return ''+
                        this.series.name +': '+ this.y +'个';
                }
            },
            plotOptions: {
                bar: {
                    borderColor: "#171c22",
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -100,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: getSeries(data)
        });
        function getSeries(value) {
            var ans = [];
            for (var i = 0; i < value.length; i++) {
                ans[i] = data[i][0];
            }
            return [{
                name: "灾害点个数",
                data:ans
            }];
        }
    }
})();