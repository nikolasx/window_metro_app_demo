(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/zhInfoInput.html", {
        ready: function (element, options) {
            createZqsbDB();
            loadInputContent();
            intElementClickFunction(); //初始化元素事件
            registerEventsInContent(element);
        },
        unload: function () {
            AppBarSampleUtils.removeAppBars();
        }
    });

    //加载录入详情内容板子
    function loadInputContent() {
        var parentWidth = $("#zhinfoInputContainer").width();
        var parentHeight = $("#zhinfoInputContainer").height();
        var contentDiv = $("<div>");
        contentDiv.addClass("zhinfoContentBZ");
        contentDiv.css({
            "width": parentWidth + "px",
            "height": parentHeight + "px",
            "overflow": "hidden",
            "position": "absolute"
        });
        //contentDiv.css("width", parentWidth * 7 + "px").css("height", parentHeight + "px").css("overflow", "auto").css("position", "absolute").css("z-index","500");

        //位置
        var inputZhPosition = $("<div>");
        inputZhPosition.addClass("zhInfoContainerChildren");
        inputZhPosition.addClass("iAmSelectedzhInfoContainerChildren");
        inputZhPosition.append(createInputInfo("zhPosition"));
        //时间
        var inputZhTime = $("<div>");
        inputZhTime.addClass("zhInfoContainerChildren");
        inputZhTime.append(createInputInfo("zhTime"));
        //类型
        var inputZhType = $("<div>");
        inputZhType.addClass("zhInfoContainerChildren");
        inputZhType.append(createInputInfo("zhType"));
        //等级
        var inputZhGrade = $("<div>");
        inputZhGrade.addClass("zhInfoContainerChildren");
        inputZhGrade.append(createInputInfo("zhGrade"));
        //规模
        var inputZhScale = $("<div>");
        inputZhScale.addClass("zhInfoContainerChildren");
        inputZhScale.append(createInputInfo("zhScale"));
        //伤亡
        var inputZhPeople = $("<div>");
        inputZhPeople.addClass("zhInfoContainerChildren");
        inputZhPeople.append(createInputInfo("zhPeople"));
        //经济损失   
        var inputZhEcnomic = $("<div>");
        inputZhEcnomic.addClass("zhInfoContainerChildren");
        inputZhEcnomic.append(createInputInfo("zhEcnomic"));

        contentDiv.append(inputZhPosition).append(inputZhTime).append(inputZhType).append(inputZhType).append(inputZhGrade).append(inputZhScale).append(inputZhPeople).append(inputZhEcnomic);
        $("#zhinfoInputContainer").append(contentDiv);
        $(".zhInfoContainerChildren").css({
            "width": parentWidth + "px",
            "height": parentHeight + "px",
        });
        $(".GJZValiage").show();
    }
    //初始化元素事件
    function intElementClickFunction() {
        $(".inputInfoItem").click(function () {
            var obj = $(this);
            if (obj.hasClass("selectInfoItem")) {
                return;
            }
            else {
                var objId = obj.attr("id");
                //更改样式 
                $(".selectInfoItem").removeClass("selectInfoItem");
                obj.addClass("selectInfoItem");
                var infoitemsIndex = $(".inputInfoItem").index(obj);
                var zhInfoContainerChildrenObj = $(".zhInfoContainerChildren").eq(infoitemsIndex);
                if (zhInfoContainerChildrenObj.hasClass("iAmSelectedzhInfoContainerChildren")) {
                    return;
                } else {
                    $(".iAmSelectedzhInfoContainerChildren").hide();
                    zhInfoContainerChildrenObj.fadeIn("slow");
                    $(".zhInfoContainerChildren").removeClass("iAmSelectedzhInfoContainerChildren");
                    zhInfoContainerChildrenObj.addClass("iAmSelectedzhInfoContainerChildren");
                }

            }
        });
    }
    //制造录入信息详情
    function createInputInfo(type) {
        var tempStr = "";
        switch (type) {
            case "zhPosition":
                tempStr =
                    '<div class="zhPositionInfo">' +
                        '<div class="zhPositionInfoTitle">县（区）</div>' +
                        '<div class="zhPositionInfoCon zhPositionXQCon">' +
                            '<div class="zhPositionInfoConChildren">甘井子区</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="zhPositionInfo">' +
                        '<div class="zhPositionInfoTitle">乡（镇）</div>' +
                        '<div class="zhPositionInfoCon zhPositionXZCon">' +
                            '<div class="zhPositionInfoConXZChildren" id="gjzstreet">甘井子街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="nglstreet">南关岭街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="jcstreet">机场街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="hqstreet">红旗街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="gzbstreet">革镇堡街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="yczstreet">营城子街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="xhstreet">兴华街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="qsstreet">泉水街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="xzzstreet">辛寨子街道</div>' +
                            '<div class="zhPositionInfoConXZChildren" id="zszstreet">周水子街道</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="zhPositionInfo">' +
                        '<div class="zhPositionInfoTitle" style="margin-top:130px">村</div>' +
                        '<div class="zhPositionInfoCon zhPositionXCCon">' +
                            '<div class="zhPositionInfoConVChildren GJZValiage">甘1村</div>' +
                            '<div class="zhPositionInfoConVChildren GJZValiage">甘2村</div>' +
                            '<div class="zhPositionInfoConVChildren NGLValiage">南关1村</div>' +
                            '<div class="zhPositionInfoConVChildren NGLValiage">南关2村</div>' +
                            '<div class="zhPositionInfoConVChildren JCValiage">机场1村</div>' +
                            '<div class="zhPositionInfoConVChildren JCValiage">机场2村</div>' +
                            '<div class="zhPositionInfoConVChildren HQValiage">红旗1村</div>' +
                            '<div class="zhPositionInfoConVChildren HQValiage">红旗2村</div>' +
                            '<div class="zhPositionInfoConVChildren GZBValiage">革镇堡1村</div>' +
                            '<div class="zhPositionInfoConVChildren GZBValiage">革镇堡2村</div>' +
                            '<div class="zhPositionInfoConVChildren YCZValiage">营城子1村</div>' +
                            '<div class="zhPositionInfoConVChildren YCZValiage">营城子2村</div>' +
                            '<div class="zhPositionInfoConVChildren XHValiage">兴华1村</div>' +
                            '<div class="zhPositionInfoConVChildren XHValiage">兴华2村</div>' +
                            '<div class="zhPositionInfoConVChildren QSValiage">泉水1村</div>' +
                            '<div class="zhPositionInfoConVChildren QSValiage">泉水2村</div>' +
                            '<div class="zhPositionInfoConVChildren XZZValiage">辛寨子1村</div>' +
                            '<div class="zhPositionInfoConVChildren XZZValiage">辛寨子2村</div>' +
                            '<div class="zhPositionInfoConVChildren ZSZValiage">周水子1村</div>' +
                            '<div class="zhPositionInfoConVChildren ZSZValiage">周水子2村</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="zhPositionInfo">' +
                        '<div class="zhPositionInfoTitle" style="margin-top:70px">组</div>' +
                        '<div class="zhPositionInfoCon zhPositionZCon">' +
                          '<div class="zhPositionInfoConGroupChildren">1组</div>' +
                          '<div class="zhPositionInfoConGroupChildren">2组</div>' +
                        '</div>' +
                    '</div>';
                break;
            case "zhTime":
                tempStr = '<div class="zhPositionInfo">' +
                        '<div class="zhPositionInfoTitle">发生时间</div>' +
                        '<div class="zhTimeInfoCon">' +
                            '<div id="zhTimeInfoConChildren"></div>' +
                        '</div>' +
                      '</div>';
                break;
            case "zhType":
                tempStr =
                    '<div class="zhTypeInfo">' +
                        '<div class="zhTypeInfoTitle">灾害类型</div>' +
                        '<div class="zhTypeInfoCon">' +
                            '<div class="zhTypeInfoConChildren">崩塌</div>' +
                            '<div class="zhTypeInfoConChildren">滑坡</div>' +
                            '<div class="zhTypeInfoConChildren">泥石流</div>' +
                            '<div class="zhTypeInfoConChildren">地裂缝</div>' +
                            '<div class="zhTypeInfoConChildren">危险斜坡</div>' +
                            '<div class="zhTypeInfoConChildren">地面塌陷</div>' +
                            '<div class="zhTypeInfoConChildren">地面沉降</div>' +
                        '</div>' +
                    '</div>';
                break;
            case "zhGrade":
                tempStr =
                '<div class="zhGradeInfo">' +
                    '<div class="zhGradeInfoTitle">灾害等级</div>' +
                    '<div class="zhGradeInfoCon">' +
                        '<div class="zhGradeInfoConChildren">小型</div>' +
                        '<div class="zhGradeInfoConChildren">中型</div>' +
                        '<div class="zhGradeInfoConChildren">大型</div>' +
                        '<div class="zhGradeInfoConChildren">特大型</div>' +
                    '</div>' +
                '</div>';
                break;
            case "zhScale":
                tempStr =
                '<div class="zhScaleInfo">' +
                    '<div class="zhScaleInfoTitle">灾害规模</div>' +
                    '<div class="zhScaleInfoCon">' +
                        '<div class="zhScaleInfoConChildren">小型</div>' +
                        '<div class="zhScaleInfoConChildren">中型</div>' +
                        '<div class="zhScaleInfoConChildren">大型</div>' +
                        '<div class="zhScaleInfoConChildren">特大型</div>' +
                    '</div>' +
                '</div>';
                break;
            case "zhPeople":
                tempStr =
                '<div class="zhPeopleInfo">' +
                    //'<div class="zhPeopleInfoTitle">伤亡情况</div>' +
                    '<div class="zhPeopleInfoCon">' +
                        '<div class="zhPeopleInfoConChildren">受伤人数</div>' +
                        '<input type="text" class="zhInfoInputBox" id="zhHurt"/>' +
                        '<div class="zhPeopleInfoConChildren">死亡人数</div>' +
                        '<input type="text" class="zhInfoInputBox" id="zhDie"/>' +
                        '<div class="zhPeopleInfoConChildren">失踪人数</div>' +
                        '<input type="text" class="zhInfoInputBox" id="zhMiss"/>' +
                    '</div>' +
                '</div>';
                break;
            case "zhEcnomic":
                tempStr =
                '<div class="zhEcnomicInfo">' +
                    '<div class="zhEcnomicInfoTitle">直接经济损失</div>' +
                    '<div class="zhEcnomicInfoCon">' +
                        '<input type="text" class="zhInfoInputBox" id="zhEcnomicLose"/><label class="zhEcnomicLabel">   万</label>' +
                    '</div>' +
                '</div>';
                break;
        }
        return tempStr;
    }
    //注册详情事件
    function registerEventsInContent(element) {
        //灾害地点-县区点击事件
        $(".zhPositionInfoConChildren").click(function () {
            var clickedObject = $(this);
            if (clickedObject.hasClass("itemSelected")) {
                clickedObject.removeClass("itemSelected");
                return;
            } else {
                $(".zhPositionInfoConXZChildren").removeClass("itemSelected");
                clickedObject.addClass("itemSelected");
            }
        });
        //灾害地点-街道点击事件
        $(".zhPositionInfoConXZChildren").click(function () {
            var clickedObject = $(this);
            if (clickedObject.hasClass("itemSelected")) {
                clickedObject.removeClass("itemSelected");
                return;
            } else {
                $(".zhPositionInfoConXZChildren").removeClass("itemSelected");
                clickedObject.addClass("itemSelected");
                handleStreetAndValiage(clickedObject.attr("id"));
            }
        });
        //灾害地点-村点击事件
        $(".zhPositionInfoConVChildren").click(function () {
            publicUtilforClick($(this), "zhPositionInfoConVChildren", null, null);
        });

        //灾害地点-组点击事件
        $(".zhPositionInfoConGroupChildren").click(function () {
            publicUtilforClick($(this), "zhPositionInfoConGroupChildren", null, null);
        });

        //灾害时间点控件
        //var initialDate = new Date(1990, 8, 1, 0, 0, 0, 0);
        var zhDatepickerContainer = element.querySelector("#zhTimeInfoConChildren")
        var zhDatepickerControls = new WinJS.UI.DatePicker(zhDatepickerContainer)
        zhDatepickerControls.element.addEventListener("change", function () {
            var timeZH = zhDatepickerControls.current.toLocaleDateString();
            if ($("#zhTime").find(".infoItemsImg").hasClass("infoItemsImg")) {
                $("#zhTime").find(".infoItemsImg").removeClass("infoItemsImg").addClass("infoItemsText");
            }
            $("#zhTimeShort").text(timeZH);
        });

        //灾害类型
        $(".zhTypeInfoConChildren").click(function () {
            publicUtilforClick($(this), "zhTypeInfoConChildren",
                //取消选择回调
                function () {
                    if ($("#zhType").find(".infoItemsText").hasClass("infoItemsText")) {
                        $("#zhType").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
                    }
                    $("#zhTypeShort").text("");
                },
                //选择时回调
                function () {
                    if ($("#zhType").find(".infoItemsImg").hasClass("infoItemsImg")) {
                        $("#zhType").find(".infoItemsImg").removeClass("infoItemsImg").addClass("infoItemsText");
                    }
                    $("#zhTypeShort").text($(".zhTypeInfoCon").find(".itemSelected").text());
                });
        });

        //灾害等级
        $(".zhGradeInfoConChildren").click(function () {
            publicUtilforClick($(this), "zhGradeInfoConChildren",
                function () {
                    if ($("#zhGrade").find(".infoItemsText").hasClass("infoItemsText")) {
                        $("#zhGrade").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
                    }
                    $("#zhGradeShort").text("");
                },
                function () {
                    if ($("#zhGrade").find(".infoItemsImg").hasClass("infoItemsImg")) {
                        $("#zhGrade").find(".infoItemsImg").removeClass("infoItemsImg").addClass("infoItemsText");
                    }
                    $("#zhGradeShort").text($(".zhGradeInfoCon").find(".itemSelected").text());
                });
        });
        //灾害规模
        $(".zhScaleInfoConChildren").click(function () {
            publicUtilforClick($(this), "zhScaleInfoConChildren",
                function () {
                    if ($("#zhScale").find(".infoItemsText").hasClass("infoItemsText")) {
                        $("#zhScale").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
                    }
                    $("#zhScaleShort").text("");
                },
                function () {
                    if ($("#zhScale").find(".infoItemsImg").hasClass("infoItemsImg")) {
                        $("#zhScale").find(".infoItemsImg").removeClass("infoItemsImg").addClass("infoItemsText");
                    }
                    $("#zhScaleShort").text($(".zhScaleInfoCon").find(".itemSelected").text());
                });
        });
        //伤亡人数        //直接经济损失
        $(".zhInfoInputBox").focus(function () {
            $(this).addClass("zhInfoInputBoxOnFocus");
        });
        $(".zhInfoInputBox").blur(function () {
            var objBlur = $(this);
            if (isNaN($(this).val())) {
                var md = new Windows.UI.Popups.MessageDialog('请输入数值型数据!', 'Error');
                var resutlt;
                var cmd;
                cmd = new Windows.UI.Popups.UICommand();
                cmd.label = '关闭';
                cmd.invoked = function (c) {
                    resutlt = c.label;
                }
                md.commands.append(cmd);
                md.showAsync().then(function (c) {
                    //console.log('answer:' + resutlt);
                    objBlur.val("");
                    objBlur.removeClass("zhInfoInputBoxOnFocus");
                });

                return;
            }
            $(this).removeClass("zhInfoInputBoxOnFocus");
            var tempStr = "";
            if ($(this).parent().hasClass("zhPeopleInfoCon")) {
                var zhhurtPeople = $("#zhHurt").val() == "" ? "0" : $("#zhHurt").val();
                var zhdiePeople = $("#zhDie").val() == "" ? "0" : $("#zhDie").val();
                var zhmissPeople = $("#zhMiss").val() == "" ? "0" : $("#zhMiss").val();
                //tempStr = "伤" + zhhurtPeople + "人，亡" + zhdiePeople + "人，失踪" + zhmissPeople + "人";
                if ($("#zhHurt").val() != "") {
                    tempStr = tempStr + "|伤" + zhhurtPeople + "人";
                }

                if ($("#zhDie").val() != "") {
                    tempStr = tempStr + "|亡" + zhdiePeople + "人";
                }

                if ($("#zhMiss").val() != "") {
                    tempStr = tempStr + "|失踪" + zhmissPeople + "人";
                }

                if (tempStr != "") {
                    if ($("#zhPeople").find(".infoItemsImg").hasClass("infoItemsImg")) {
                        $("#zhPeople").find(".infoItemsImg").removeClass("infoItemsImg").addClass("infoItemsText");
                    }
                    $("#zhPeopleShort").text(tempStr);
                } else {
                    if ($("#zhPeople").find(".infoItemsText").hasClass("infoItemsText")) {
                        $("#zhPeople").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
                    }
                    $("#zhPeopleShort").text(tempStr);
                }
            } else {
                tempStr = $("#zhEcnomicLose").val() == "" ? "" : $("#zhEcnomicLose").val();
                if (tempStr != "") {
                    if ($("#zhEcnomic").find(".infoItemsImg").hasClass("infoItemsImg")) {
                        $("#zhEcnomic").find(".infoItemsImg").removeClass("infoItemsImg").addClass("infoItemsText");
                    }
                    $("#zhEcnomicShort").text(tempStr);
                } else {
                    if ($("#zhEcnomic").find(".infoItemsText").hasClass("infoItemsText")) {
                        $("#zhEcnomic").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
                    }
                    $("#zhEcnomicShort").text(tempStr);
                }
            }
        });
        //上传重置按钮
        $(".infoInputButton").click(function () {
            var clickedObj = $(this);
            //样式
            if (clickedObj.hasClass("infoInputButtonClick")) {
                //return;
            } else {
                $(".infoInputButton").removeClass("infoInputButtonClick");
                clickedObj.addClass("infoInputButtonClick");
            }
            //事件
            if (clickedObj.attr("id") == "infoInputOK") {
                //上传
                var checkInputInfo = checkInputIsLegal();
                if (checkInputInfo) {
                    $("#zqsbInputMsgBackground").fadeIn("normal", function () {
                        $("#zqsbInfoBoxPage1").show();
                        $("#zqsbInputMsgShowBox").slideToggle("slow", function () {
                            $(".pagezoom-view").css("width", $("#map").css("width"));
                            $(".pagezoom-view").css("overflow-x", "hidden");
                        });
                    });
                } else {
                    var md = new Windows.UI.Popups.MessageDialog('录入信息不完整，请检查输入：\n区、街道、村、组及灾害类型为必填信息!', 'Error');
                    var resutlt;
                    var cmd;
                    cmd = new Windows.UI.Popups.UICommand();
                    cmd.label = '关闭';
                    cmd.invoked = function (c) {
                        resutlt = c.label;
                    }
                    md.commands.append(cmd);
                    md.showAsync().then(function (c) {
                        console.log('answer:' + resutlt);
                    });
                }
                //uploadZhInfoData();
            } else {
                resetInputContent();
            }
        });
        //通知页按钮-确定按钮事件
        $("#zqsbInfoBoxP1OK").click(function () {
            var clickedObj = $(this);
            clickedObj.addClass("zqsbInfoBoxButtonClicked");
            $("#zqsbInfoBoxPage1").fadeOut("slow", function () {
                $("#zqsbInfoBoxP2TiSHI").empty();
                $("#zqsbInfoBoxPage2").fadeIn("fast", function () {
                    uploadZhInfoData();
                });
            });
        });

        $("#zqsbInfoBoxP1CANCEL").click(function () {
            var clickedObj = $(this);
            clickedObj.addClass("zqsbInfoBoxButtonClicked");
            $("#zqsbInputMsgShowBox").slideToggle("slow", function () {
                clickedObj.removeClass("zqsbInfoBoxButtonClicked");
                $("#zqsbInputMsgBackground").fadeOut("normal", function () {
                    $(".pagezoom-view").css("width", "100%");
                    $(".pagezoom-view").css("overflow-x", "auto");
                });
            });
        });
    }
    //重置内容输入区
    function resetInputContent() {
        //重置
        $(".zhPositionInfoConChildren").removeClass("itemSelected");
        $(".zhPositionInfoConXZChildren").removeClass("itemSelected");
        $(".zhPositionInfoConVChildren").removeClass("itemSelected");
        $(".zhPositionInfoConGroupChildren").removeClass("itemSelected");
        //时间重置
        if ($("#zhTime").find(".infoItemsText").hasClass("infoItemsText")) {
            $("#zhTime").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
        }
        $("#zhTimeShort").text("");
        //灾害类型重置
        $(".zhTypeInfoConChildren").removeClass("itemSelected");
        if ($("#zhType").find(".infoItemsText").hasClass("infoItemsText")) {
            $("#zhType").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
        }
        $("#zhTypeShort").text("");
        //灾害等级重置
        $(".zhGradeInfoConChildren").removeClass("itemSelected");
        if ($("#zhGrade").find(".infoItemsText").hasClass("infoItemsText")) {
            $("#zhGrade").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
        }
        $("#zhGradeShort").text("");
        //灾害规模重置
        $(".zhScaleInfoConChildren").removeClass("itemSelected");
        if ($("#zhScale").find(".infoItemsText").hasClass("infoItemsText")) {
            $("#zhScale").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
        }
        $("#zhScaleShort").text("");
        //伤亡人数统计
        $(".zhInfoInputBox").val("");
        if ($("#zhPeople").find(".infoItemsText").hasClass("infoItemsText")) {
            $("#zhPeople").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
        }
        $("#zhPeopleShort").text("");
        if ($("#zhEcnomic").find(".infoItemsText").hasClass("infoItemsText")) {
            $("#zhEcnomic").find(".infoItemsText").removeClass("infoItemsText").addClass("infoItemsImg");
        }
        $("#zhEcnomicShort").text("");

    }
    //检查输入是否正确
    function checkInputIsLegal() {
        //区、街道、村、组
        if (!$(".zhPositionInfoConChildren").hasClass("itemSelected") || !$(".zhPositionInfoConXZChildren").hasClass("itemSelected") || !$(".zhPositionInfoConVChildren").hasClass("itemSelected") || !$(".zhPositionInfoConGroupChildren").hasClass("itemSelected") || !$(".zhTypeInfoConChildren").hasClass("itemSelected")) {
            return false;
        }
        return true;
    }
    //上传灾害速报数据
    var zqsbStoreObj = {};
    function uploadZhInfoData() {
        var timeID = new Date().getTime();
        //var timeID = time.getFullYear().toString() + time.getMonth().toString() + time.getDay().toString() + time.getHours().toString() + time.getMinutes().toString() + time.getSeconds().toString();
        zqsbStoreObj.ID = timeID;
        zqsbStoreObj.区 = $(".zhPositionXQCon").find(".itemSelected").text();
        zqsbStoreObj.街道 = $(".zhPositionXZCon").find(".itemSelected").text();
        zqsbStoreObj.村 = $(".zhPositionXCCon").find(".itemSelected").text();
        zqsbStoreObj.组 = $(".zhPositionZCon").find(".itemSelected").text();
        zqsbStoreObj.发生时间 = $("#zhTimeShort").text();
        zqsbStoreObj.灾害类型 = $("#zhTypeShort").text();
        zqsbStoreObj.灾害等级 = $("#zhGradeShort").text();
        zqsbStoreObj.灾害规模 = $("#zhScaleShort").text();
        var zhhurtPeople = $("#zhHurt").val() == "" ? "0" : $("#zhHurt").val();
        var zhdiePeople = $("#zhDie").val() == "" ? "0" : $("#zhDie").val();
        var zhmissPeople = $("#zhMiss").val() == "" ? "0" : $("#zhMiss").val();
        zqsbStoreObj.受伤人数 = zhhurtPeople;
        zqsbStoreObj.死亡人数 = zhdiePeople;
        zqsbStoreObj.失踪人数 = zhmissPeople;
        zqsbStoreObj.财产损失 = $("#zhEcnomicLose").val();
        dbWriteStart(zqsbStoreObj);
        //isFirstClick = false;
    }
    //页面点击公用处理函数
    function publicUtilforClick(operateObj, className, func1, func) {
        var clickedObject = operateObj;
        if (clickedObject.hasClass("itemSelected")) {
            clickedObject.removeClass("itemSelected");
            if (func1 != null) {
                func1();
            }
            return;
        } else {
            $("." + className).removeClass("itemSelected");
            clickedObject.addClass("itemSelected");
            if (func != null) {
                func();
            }
        }
    }
    //处理街道和对应村的转换事件
    function handleStreetAndValiage(id) {
        var valiage = "";
        switch (id) {
            case "nglstreet":
                valiage = "NGLValiage";
                break;
            case "gjzstreet":
                valiage = "GJZValiage";
                break;
            case "jcstreet":
                valiage = "JCValiage";
                break;
            case "hqstreet":
                valiage = "HQValiage";
                break;
            case "gzbstreet":
                valiage = "GZBValiage";
                break;
            case "yczstreet":
                valiage = "YCZValiage";
                break;
            case "xhstreet":
                valiage = "XHValiage";
                break;
            case "qsstreet":
                valiage = "QSValiage";
                break;
            case "xzzstreet":
                valiage = "XZZValiage";
                break;
            case "zszstreet":
                valiage = "ZSZValiage";
                break;
        }
        $(".zhPositionInfoConVChildren").hide();
        $("." + valiage).show();
        $("." + valiage).removeClass("itemSelected");
        //$("." + valiage).eq(0).addClass("itemSelected");
    }
    //关闭按钮事件
    function zqsbInfoInputP2Close() {
        var clickedObj = $(this);
        clickedObj.addClass("zqsbInfoBoxButtonClicked");
        $("#zqsbInputMsgShowBox").slideToggle("slow", function () {
            clickedObj.removeClass("zqsbInfoBoxButtonClicked");
            $("#zqsbInputMsgBackground").fadeOut("normal", function () {
                $(".pagezoom-view").css("width", "100%");
                $(".pagezoom-view").css("overflow-x", "auto");
                resetInputContent();
            });
        });
    }

    /*
    * 创建速报数据库、读写数据库函数
    */
    var zqsbNameSpace = {};
    zqsbNameSpace.DB = null;
    var firstcreate = false;
    //创建数据库
    function createZqsbDB() {
        var dbRequest = window.indexedDB.open("zqsbDB", 1);
        dbRequest.onerror = function () { };
        //数据库第一次创建的时候执行该函数
        dbRequest.onupgradeneeded = function (evt) {
            dbFirstCreate(evt);
        };
        //dbRequest这个动作执行完成并成功后执行该函数
        dbRequest.onsuccess = function (evt) {
            //判断是不是第一次创建，如果不是第一次创建的话要把这个数据库关掉，后面用
            if (!firstcreate) {
                var db = evt.target.result;
                db.close();
                return;
            }
        };
        firstcreate = false;
    }
    //数据库第一次创建的时候调用，创建存贮结构
    function dbFirstCreate(evt) {
        //如果数据库之前被打开过，则把数据库关闭
        if (zqsbNameSpace.DB) {
            zqsbNameSpace.DB.close();
        }
        zqsbNameSpace.DB = evt.target.result;
        //获取Transaction
        var txn = evt.target.transaction;
        var zqsbStore = zqsbNameSpace.DB.createObjectStore("zqsbtable", { keyPath: "ID", autoIncrement: true });
        zqsbStore.createIndex("ID", "ID", { unique: true });
        zqsbStore.createIndex("region", "区", { unique: false });
        zqsbStore.createIndex("street", "街道", { unique: false });
        zqsbStore.createIndex("village", "村", { unique: false });
        zqsbStore.createIndex("group", "组", { unique: false });
        zqsbStore.createIndex("time", "发生时间", { unique: false });
        zqsbStore.createIndex("type", "灾害类型", { unique: false });
        zqsbStore.createIndex("grade", "灾害等级", { unique: false });
        zqsbStore.createIndex("scale", "灾害规模", { unique: false });
        zqsbStore.createIndex("hurt", "受伤人数", { unique: false });
        zqsbStore.createIndex("die", "死亡人数", { unique: false });
        zqsbStore.createIndex("miss", "失踪人数", { unique: false });
        zqsbStore.createIndex("economic", "财产损失", { unique: false });
        // Once the creation of the object stores is finished (they are created asynchronously), log success.
        txn.oncomplete = function () { };
        firstcreate = true;
    }
    //开始写入数据
    function dbWriteStart(recieveData) {
        var dbRequest = window.indexedDB.open("zqsbDB", 1);
        dbRequest.onerror = function () { };
        dbRequest.onsuccess = function (evt) { dbWriteProcess(evt, recieveData); };
        dbRequest.onupgradeneeded = function (evt) { if (zqsbNameSpace.DB) { zqsbNameSpace.DB.close(); } };
        dbRequest.onblocked = function () { };
    }
    //写入数据库的地方
    function dbWriteProcess(evt, data) {
        zqsbNameSpace.DB = evt.target.result;
        var dataObj = data;
        var txn = zqsbNameSpace.DB.transaction(["zqsbtable"], "readwrite");
        txn.oncomplete = function (evt) {
            zqsbNameSpace.DB.close();
            $("#zqsbInfoBoxP2TiSHI").html("数据上传完毕");
            $("#zqsbInfoBoxP2CLOSE").bind("click", zqsbInfoInputP2Close);
        };
        txn.onerror = function (evt) { };
        txn.onabort = function () { };

        var infoStore = txn.objectStore("zqsbtable");
        var addResult = infoStore.add(dataObj);
        addResult.ID = dataObj.ID;
        addResult.region = dataObj.区;
        addResult.steet = dataObj.街道;
        addResult.village = dataObj.村;
        addResult.group = dataObj.组;
        addResult.time = dataObj.发生时间;
        addResult.type = dataObj.灾害类型;
        addResult.grade = dataObj.灾害等级;
        addResult.scale = dataObj.灾害规模;
        addResult.hurt = dataObj.受伤人数;
        addResult.die = dataObj.死亡人数;
        addResult.miss = dataObj.失踪人数;
        addResult.economic = dataObj.财产损失;
        addResult.onsuccess = function (e) {
            var event = e;
        }
        addResult.onerror = function () {
        }

    }
})();