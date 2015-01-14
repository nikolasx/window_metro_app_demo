(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/disasterInfoDetail.html", {
        ready: function (element, options) {
            //接收上个页面传过的 参数 并根据参数 加载详细信息
            addDetailBack();
            initDetail(options.SelectId);
            appBar.disabled = true;
        },
        unload: function () {

        }
    });

    //点击返回按钮
    function addDetailBack() {
        $("#goBackToDisasterList,.infodetail_top_title").click(function () {
            $("#secondClassPages").css("width", "0");
            $("#initPage").css("width", "100%");
            appBar.disabled = false;
        });
    }

    //详情展示页面初始化函数
    function initDetail(id) {
        getInfoDetail(id);
    }

    //根据传进来的数据，转化成data格式，插入页面展示
    function getInfoDetail(currentItemId) {
        //1380265919006    getZqsbData("滑坡", "type"funtion(){});

        //根据选中项的ID，查询详细信息
        getZqsbData(currentItemId, "ID", function (values) {
            if (values.length > 0) {
                var dataObj;
                for (var i = 0; i < values.length; i++) {
                    var data = values[i];
                    //定义灾害详情数据结构
                    dataObj = {
                        addressQU: data.区,   //灾情地点的区
                        addressJIE: data.街道,  //灾情地点的街道
                        addressCUN: data.村,     //灾情地点所在村
                        addressZU:data.组,
                        time: data.发生时间,   //发生时间
                        disasterLX: data.灾害类型,      //灾害类型
                        disasterGrade: data.灾害等级,       //灾害等级
                        disasterScale: data.灾害规模,       //灾害规模
                        disappear:data.失踪人数,
                        injured: data.受伤人数,         //伤亡人数
                        died: data.死亡人数,
                        picture:data.灾害点图片,
                        economicLose: data.财产损失      //经济损失
                    };
                }
                insertInfoDetail(dataObj);
                insertInfoPic(dataObj.picture);
            }
            else {

            }

        });
    }

    //在页面中展示灾害信息详情
    function insertInfoDetail(data) {
        if (data.addressQU != "") $(".infoDetailRows_content").eq(0).append('<span>' + data.addressQU + '</span>');
        if (data.addressJIE != "") $(".infoDetailRows_content").eq(0).append('<span>' + data.addressJIE + '</span>');
        if (data.addressCUN != "") $(".infoDetailRows_content").eq(0).append('<span>' + data.addressCUN + '</span>');
        if (data.addressZU != "") $(".infoDetailRows_content").eq(0).append('<span>' + data.addressZU + '</span>');
        if (data.time != "") $(".infoDetailRows_content").eq(1).append('<span>' + data.time + '</span>');
        if (data.disasterLX != "") $(".infoDetailRows_content").eq(2).append('<span>' + data.disasterLX + '</span>');
        if (data.disasterGrade != "") $(".infoDetailRows_content").eq(3).append('<span>' + data.disasterGrade + '</span>');
        if (data.disasterScale != "") $(".infoDetailRows_content").eq(4).append('<span>' + data.disasterScale + '</span>');
        if (data.disappear != "" ) $(".infoDetailRows_content").eq(5).append('<span>' + data.disappear + '人失踪</span>');
        if (data.injured != "" ) $(".infoDetailRows_content").eq(5).append('<span>' + data.injured + '人受伤</span>');
        if (data.died != "") $(".infoDetailRows_content").eq(5).append('<span>' + data.died + '人死亡</span>');
        if (data.economicLose != "") $(".infoDetailRows_content").eq(6).append('<span>' + data.economicLose + '万元</span>');
    }
    
    var picUrl = [];  //记录灾害点图片路径
    var imgSelected = 0;
    var picName;
    //插入灾害点图片

    function insertInfoPic(picture) {
        picUrl = [];
        picName = picture.split(";");
        if (picName[0] != "") {
            getPicUrl(picName, 0);
        }
    }
    //采用递归的方法打开文件获取路径
    function getPicUrl(picName, index) {
        if (index < picName.length) {
            Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("disasterPicture").then(function (fileFold) {
                fileFold.getFileAsync(picName[index]).done(function (file) {
                    if (file) {
                        var photoBlobUrl = URL.createObjectURL(file, { oneTimeOnly: true });
                        picUrl[picUrl.length] = photoBlobUrl;
                        return getPicUrl(picName, index + 1);
                    }
                });
            });
        } else {
            return showDetailPic();
        }
    }
    //在页面上展示图片
    function showDetailPic() {
        if (picUrl.length > 3) {
            $("#infoDetailLeft_preimgBox").css("width",178*(picUrl.length-3)+510+"px");
            for (var i = 0; i < picUrl.length - 3; i++) {
                $("#infoDetailLeft_preimgBox").append('<div class="infoDetailLeft_prediv"><img class="infoDetailLeft_preimg" src="../images/smallpreview.png"></div>');
            }
        }
        for (var index = 0; index < picUrl.length; index++) {
            $(".infoDetailLeft_preimg").eq(index).attr("src",picUrl[index]);
        }
        if (picUrl.length > 0) {
            $("#infoDetailLeft_img").attr("src", picUrl[0]);
            $(".infoDetailLeft_prediv").eq(0).css("border", "2px solid #03a2f5");
            addDetailPreviewClick();
        }
    }
    //添加小图片点击事件
    function addDetailPreviewClick() {
        $(".infoDetailLeft_preimg").live("click",function () {
            var index = $(".infoDetailLeft_preimg").index(this);
            if (index < picUrl.length && index != imgSelected) {
                imgSelected = index;
                $(".infoDetailLeft_preimg").eq(index).attr("src", picUrl[index]);
                $(".infoDetailLeft_prediv").css("border", "2px solid #313c47");
                $(".infoDetailLeft_prediv").eq(index).css("border","2px solid #03a2f5");
                $("#infoDetailLeft_img").hide().attr("src", picUrl[index]).fadeIn("200");
            }
        });
        //大图的点击预览事件
        $("#infoDetailLeft_img").click(function () {
            var picture = picName.join(";");
            WinJS.Navigation.navigate("/html/imageView.html", { picName: picture, fileFold: "disasterPicture", flag: "InfoDetail",imgSelected:imgSelected });
        });
    }
})();


