/**
*copyright @ ZONDY WEBGIS RRTEAM 2013
*/

/**
* @requires jquery-1.7.1.min.js
* @requires OpenLayers.js
*/


/**
*命名空间
*如果使用本插件之前引用了相同命名空间内的其它插件，请将该定义注释
*/
window.Rrteam = {};
Rrteam.Control = OpenLayers.Class(Rrteam, {
});


/**
*Class: RrTeam.Control.CheckDivBox
*使用DIV替换原始CheckBox
*/
Rrteam.Control.CheckDivBox = OpenLayers.Class({

    //-----------------Property-------------------//
    parentID: "",
    id: "",
    guid: null,
    nums: 2,
    dataArray: [],
    childrenDistance: 10,
    motherDivId: "",
    childrenDivClass: "CheckDivBox",
    selectAllClass: "CheckDivSelectAll",


    //每个DIV高宽
    width: 30,
    height: 20,
    //右上角选中图标高宽
    imageW: 23,
    imageH: 23,
    //Border线宽
    borderW: 3,

    isAllSelectBotton: false,




    //-----------------Function-------------------//
    initialize: function (parentID, id, option) {
        this.parentID = parentID;
        this.id = id;
        this.guid = this.GUIDFactory();
        OpenLayers.Util.extend(this, option);
        this.childrenDivClass = this.childrenDivClass + "_" + this.guid;
        this.selectAllClass = this.selectAllClass + "_" + this.guid;
        this.initMotherDiv();
        this.addChildrenDiv();
        this.registerEvent();
    },

    initMotherDiv: function () {
        //母版 动态ID
        var motherDiv = $("<div>");
        this.motherDivId = this.id + "_motherDiv";
        motherDiv.attr("id", this.motherDivId);
        //添加
        $("#" + this.parentID).append(motherDiv);
        //设置样式
        //母版宽，每行展示几个DIV，每个DIV宽+边框宽，DIV间距
        var w = (this.width + this.borderW * 2 + this.childrenDistance) * this.nums;
        motherDiv.width(w);
        //母版高，数据长度，每行显示几个，DIV间距
        var h;
        //是否需要多选
        if (this.isAllSelectBotton) {
            h = (this.height + this.borderW * 2 + this.childrenDistance) * Math.ceil((this.dataArray.length + 1) / this.nums);
        } else {
            h = (this.height + this.borderW * 2 + this.childrenDistance) * Math.ceil(this.dataArray.length / this.nums);
        }
        motherDiv.height(h);
    },

    addChildrenDiv: function () {
        //添加Children节点
        var length = this.dataArray.length;
        if (this.isAllSelectBotton) {
            var child = $("<div>");
            child.addClass(this.selectAllClass).addClass("CheckDivSelectAll").css({ width: this.width, height: this.height, float: "left" });
            child.css("margin-right", this.childrenDistance + "px").css("margin-bottom", this.childrenDistance + "px").css("border-width", this.borderW + "px");
            var imgDiv = $("<div class='right_top_img'>");
            imgDiv.width(this.imageW);
            imgDiv.height(this.imageH);
            //imgDiv.css({ position: "absolute" });
            var mLeft = this.width - this.imageW;
            imgDiv.css("margin-left", mLeft + "px").css("margin-top", "0px");
            child.append(imgDiv);
            var contentDiv = "<div style='position:relative;text-align:center;top:-10px;color:white;font-size:large;font-weight:bolder;'>" + "全&nbsp;&nbsp;&nbsp;选" + "</div>";
            child.append(contentDiv);
            $("#" + this.motherDivId).append(child);
        }
        for (var i = 0; i < length; i++) {
            var child = $("<div>");
            child.addClass(this.childrenDivClass).addClass("CheckDivBox").css({ width: this.width, height: this.height, float: "left" });
            child.css("margin-right", this.childrenDistance + "px").css("margin-bottom", this.childrenDistance + "px").css("border-width", this.borderW + "px");


            //左上角图片div
            var imgDiv = $("<div class='right_top_img'>");
            imgDiv.width(this.imageW);
            imgDiv.height(this.imageH);
            //imgDiv.css({ position: "absolute" });
            var mLeft = this.width - this.imageW;
            imgDiv.css("margin-left", mLeft + "px").css("margin-top", "0px");
            child.append(imgDiv);
            //传入数据
            var contentDiv = this.dataArray[i];
            child.append(contentDiv);
            $("#" + this.motherDivId).append(child);
        }

        
    },

    //注册事件
    registerEvent: function () {
        //hover效果
        $("." + this.childrenDivClass).hover(function () {
            $(this).addClass("CheckDivBoxHover");
        },
        function () {
            $(this).removeClass("CheckDivBoxHover");
        });


        //普通选项click事件
        var selectDiv = this.selectAllClass;
        var childrenDivs = this.childrenDivClass;
        var dataLength = this.dataArray.length;
        $("." + this.childrenDivClass).click
        (
            function () {
                if ($(this).hasClass("SelectedCheckDivBox")) {
                    //关联全选按钮
                    if ($("." + selectDiv).hasClass("AllSelectedDivBox")) {
                        $("." + selectDiv).removeClass("AllSelectedDivBox");
                        $("." + selectDiv).find(".right_top_img").removeClass("right_top_img_Selected");
                    }
                    $(this).removeClass("SelectedCheckDivBox");
                    $(this).find(".right_top_img").removeClass("right_top_img_Selected");
                } else {
                    $(this).addClass("SelectedCheckDivBox");
                    $(this).find(".right_top_img").addClass("right_top_img_Selected");
                    //如果点选的是最后一个，则把全选按钮勾上
                    if ($(".SelectedCheckDivBox").length == dataLength) {
                        $("." + selectDiv).addClass("AllSelectedDivBox");
                        $("." + selectDiv).find(".right_top_img").addClass("right_top_img_Selected");
                    }
                }
            }
        );
        //全选按钮事件
        if (this.isAllSelectBotton) {
            $("." + this.selectAllClass).hover(
                function () {
                    $(this).addClass("CheckDivBoxHover");
                },
                function () {
                    $(this).removeClass("CheckDivBoxHover");
                }
            );

            $("." + this.selectAllClass).click(
                function () {
                    if ($(this).hasClass("AllSelectedDivBox")) {
                        //样式调整
                        $(this).removeClass("AllSelectedDivBox");
                        $(this).find(".right_top_img").removeClass("right_top_img_Selected");
                        //取消普通选项选择
                        $("." + childrenDivs).removeClass("SelectedCheckDivBox");
                        $("." + childrenDivs).find(".right_top_img").removeClass("right_top_img_Selected");
                    } else {
                        $(this).addClass("AllSelectedDivBox");
                        $(this).find(".right_top_img").addClass("right_top_img_Selected");
                        //关联普通选项
                        $("." + childrenDivs).addClass("SelectedCheckDivBox");
                        $("." + childrenDivs).find(".right_top_img").addClass("right_top_img_Selected");
                    }
                });
        }
    },

    //返回当前选定对象给用户
    getSelectValues: function () {
        var resultValue = [];
        var AllObjArr = $("." + this.childrenDivClass);
        for (var i = 0; i < AllObjArr.length; i++) {
            if ($(AllObjArr[i]).hasClass("SelectedCheckDivBox")) {
                resultValue.push(AllObjArr[i]);
            }
        }
        return resultValue;
    },

    //返回当前选定对象的index值给用户
    getSelectIndex: function () {
        var resultValue = [];
        var AllObjArr = $("." + this.childrenDivClass);
        for (var i = 0; i < AllObjArr.length; i++) {
            if ($(AllObjArr[i]).hasClass("SelectedCheckDivBox")) {
                resultValue.push($(AllObjArr[i]).index());
            }
        }
        return resultValue;
    },

    //返回传入封装数据中被选中的数据
//    getSelectValueByID: function () {
//        var resultValue = [];
//        var AllObjArr = $("." + this.childrenDivClass);
//        for (var i = 0; i < AllObjArr.length; i++) {
//            if ($(AllObjArr[i]).hasClass("SelectedCheckDivBox")) {
//                var value = $(AllObjArr[i]).find("#" + this.dataArray[i].id).text();
//                resultValue.push(value);
//            }
//        }
//        return resultValue;
//    },

    //生成唯一随机码
    GUIDFactory: function () {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    },

    CLASS_NAME: "Rrteam.Control.CheckDivBox"
});






