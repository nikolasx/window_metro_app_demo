var disArr = [];//灾害点信息
(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/appSet.html", {
        ready: function (element, options) {
            initSetSelection();
            initSetMap();
        },
        unload: function () {
            AppBarSampleUtils.removeAppBars();
        }
    });

    //动态添加系统设置条件选项
    function initSetSelection() {
        var NameArray = ["地图", "业务数据", "通知", "用户信息", "注销"];
        var SelectionStr = "";
        var appSet_Right_Content = "";

        for (var i = 0; i < NameArray.length; i++) {
            var TempStr_left = '<div id="SetSelection' + i + '" class="SetSelection">' + NameArray[i] + '</div>';
            var TempStr_right = '<div id="SetRightContent' + i + '" class="SetRightContent"></div>';
            SelectionStr = SelectionStr + TempStr_left;
            appSet_Right_Content = appSet_Right_Content + TempStr_right;
        }

        //将拼接字符串添加至DOM
        $("#appSet_left_selection").append(SelectionStr);
        //设置初始样式
        $("#appSet_right").append(appSet_Right_Content);
        var leftHeight = $("#appSet_left").height();
        $(".SetRightContent").height(leftHeight);

        $(".SetSelection").eq(0).addClass("SetSelectionSelected");
        $(".SetRightContent").eq(0).css("display", "block");

        //页面左侧点击事件注册
        $(".SetSelection").click(function () {
            var setSelectionObj=$(this);
            if (setSelectionObj.hasClass("SetSelectionSelected")) {
                return;
            } else {
                var lastIndex = $(".SetSelection").index($(".SetSelectionSelected"));
                var index = $(".SetSelection").index(setSelectionObj);
                $("#SetRightContent" + lastIndex).hide();
                $("#SetRightContent" + index).fadeIn("slow");
                $(".SetSelection").removeClass("SetSelectionSelected");
                setSelectionObj.addClass("SetSelectionSelected")
            }
        });
    }

    //系统设置，地图
    function initSetMap() {
        var appSetRight_MapContent =
            '<div id="Set_mapDownLoad" class="Set_Content">' +
                '<div id="Set_mapDownLoad_Title" class="Set_Content_Title">下载地图</div>' +
                '<div id="Set_mapDownLoad_Description" class="Set_Content_Des">本地获取服务器中最新的地图数据</div>' +
                '<div id="Set_mapDownLoad_Select" class="Set_Content_Select">' +
                    '<div id="Set_mapDownLoad_Select_yx" class="Set_Content_Select_Option">区域影像图</div>' +
                    '<div id="Set_mapDownLoad_Select_yj" class="Set_Content_Select_Option">区域预警图</div>' +
                    '<div id="Set_mapDownLoad_Select_dt" class="Set_Content_Select_Option">系统底图</div>' +
                '</div>' +
                '<div id="Set_mapDownLoad_Message" class="Set_Content_Des">地图正在下载，请稍候</div>' +
            '</div>' +
            '<div id="Set_mapDelete" class="Set_Content">' +
                '<div id="Set_mapDelete_Title" class="Set_Content_Title">删除地图</div>' +
                '<div id="Set_mapDelete_Description" class="Set_Content_Des">从本地删除已经下载的地图数据</div>' +
                '<div id="Set_mapDelete_Select" class="Set_Content_Select">' +
                    '<div id="Set_mapDelete_Select_yx" class="Set_Content_Select_Option">区域影像图</div>' +
                    '<div id="Set_mapDelete_Select_yj" class="Set_Content_Select_Option">区域预警图</div>' +
                    '<div id="Set_mapDelete_Select_dt" class="Set_Content_Select_Option">系统底图</div>' +
                '</div>' +
                '<div id="Set_mapDelete_Message" class="Set_Content_Des">删除完成，本提示将在5秒后消失</div>' +
            '</div>' +
            '<div id="Set_mapUpdate" class="Set_Content">' +
                '<div id="Set_mapUpdate_Title" class="Set_Content_Title">同步地图</div>' +
                '<div id="Set_mapUpdate_Description" class="Set_Content_Des">本地与服务器地图数据进行同步</div>' +
                '<div id="Set_mapUpdate_Select" class="Set_Content_Select">' +
                    '<div id="Set_mapUpdate_Select_yx" class="Set_Content_Select_Option">区域影像图</div>' +
                    '<div id="Set_mapUpdate_Select_yj" class="Set_Content_Select_Option">区域预警图</div>' +
                    '<div id="Set_mapUpdate_Select_dt" class="Set_Content_Select_Option">系统底图</div>' +
                '</div>' +
            '</div>';

        $("#SetRightContent0").append(appSetRight_MapContent);

        var appSetRight_MapContent2 =
            '<div id="Set_mapDownLoad" class="Set_Content">' +
                '<div id="Set_mapDownLoad_Title" class="Set_Content_Title">下载数据</div>' +
                '<div id="Set_mapDownLoad_Description" class="Set_Content_Des">业务数据下载</div>' +
                '<div id="Set_mapDownLoad_Select" class="Set_Content_Select">' +
                    '<div id="Set_dataDownLoad" class="Set_Content_Select_Option">下载</div>' +
                    '<div id="progressOutput" style="display:block; position:absolute;top:0px;"></div>' +
                '</div>'
            '</div>';

        $("#SetRightContent1").append(appSetRight_MapContent2);

        $(".Set_Content_Select_Option").click(function () {
            $(".Set_Content_Select_Option").removeClass("Set_Content_Select_Option_Selected");
            $(this).addClass("Set_Content_Select_Option_Selected");
        });

        //系统地图下载
        $("#Set_mapDownLoad_Select_dt").click(function () {
            //进行网络状态判断 只有在局域网才能下载
            if (checkNetwork() == 0) {
                //创建一个下载警告框和 判断 下载
                createPopusMessage(true, '下载底图数据需要删除已有的原数据，是否继续?', '提示');
            }
            else if (checkNetwork == 1) {
                createPopusMessage(false, '请检查您的Iternet连接，目前系统只能在局域网中下载数据', '您未能连接到Iternet。');
            }
            else {
                createPopusMessage(false, '请检查您的Iternet连接', '您未能连接到Iternet。');
            }
        });
       
        //地图删除
        $("#Set_mapDelete_Select_dt").click(function () {
            //进行网络状态判断
            if (checkNetwork() == 1) {
                DeleteClickRegister();
            }
        });
        //业务数据下载
        $("#Set_dataDownLoad").click(function () {
            //进行网络状态判断
            if (checkNetwork() == 0) {
                //创建一个警告框和 判断 下载
                createDataDownloadPopusMessage();
            }
        });
    }

    //关闭删除提示框，点击事件的注册
    function DeleteClickRegister() {
        $("#message_top_close").click(function () {
            CoverMessageDisplay();
        });
        $("#message_yes").click(function () {
            DeleteIMGFolder();
            CoverMessageDisplay();
        });
        $("#message_no").click(function () {
            CoverMessageDisplay();
        });
    }

    var pages = 0;

    function addDatas() {
        getPage(function (value) {
            var pages = value;
            for (var i = 1; i <= pages; i++) {
                var url = "http://192.168.83.185/r2rest/Handler.ashx?method=GetDisasterInfo&pagesize=10&page=";
                url += i;
                if(i<pages){
                    startLoadData(url);
                }
                if(i == pages){
                    startLoadData2(url);
                }
            }
        });
    }


    //cover隐藏，提示框remove
    function CoverMessageDisplay() {
        $("#cover").hide();
        $("#message").empty();
        $(".Set_Content_Select_Option").removeClass("Set_Content_Select_Option_Selected");
    }
    
    //判断当前的网络状态,离线、连接互联网、连接局域网
    function checkNetwork() {
        var networkState = 0;   //1,0,-1分别表示 连接互联网  连接局域网 离线
        var content = "<div id='message_top'>" +
                                    "<div id='message_top_close'>×</div>" +
                                "</div>";
        try {
            var connectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            //网络类型
            var networkConnectivityInfo = Windows.Networking.Connectivity.NetworkConnectivityLevel;
            
            switch (connectionProfile.getNetworkConnectivityLevel()) {
                case networkConnectivityInfo.none:   //无网络
                    networkState = -1;
                    break;
                case networkConnectivityInfo.internetAccess:   //本地连接
                    networkState = 1;
                    break;
                case networkConnectivityInfo.localAccess:   //受限连接局域网
                    networkState = 0;
                    break;
                default:
                    break;
            }
        }
        catch (ex) {  //网络出错
            networkState = -1;
        }
        return networkState;
    }

    //弹出下载警告框
    function createPopusMessage(netWorkState,content,title) {
        var md = new Windows.UI.Popups.MessageDialog(content, title);
        var result, resultOptions = ['是', '否'];
        if (netWorkState) {
            resultOptions = ['是', '否'];
        }
        else {
            resultOptions = ['关闭'];
        }
        var cmd;
        for (var i = 0; i < resultOptions.length; i++) {
            cmd = new Windows.UI.Popups.UICommand();
            cmd.label = resultOptions[i];
            cmd.invoked = function (c) {
                result = c.label;
                if (result == '是') {
                    DeleteIMGFolder();
                    bufferMap();
                    $("#schedule").show();
                }
                $("#Set_mapDownLoad_Select_dt").removeClass("Set_Content_Select_Option_Selected");
            }
            md.commands.append(cmd);
        }
        //显示弹出框
        md.showAsync();
    }
    //数据下载弹出下载警告框
    function createDataDownloadPopusMessage() {
        var md = new Windows.UI.Popups.MessageDialog('下载底图数据需要删除已有的原数据，是否继续?', '提示');
        var result, resultOptions = ['是', '否'];
        var cmd;
        for (var i = 0; i < resultOptions.length; i++) {
            cmd = new Windows.UI.Popups.UICommand();
            cmd.label = resultOptions[i];
            cmd.invoked = function (c) {
                result = c.label;
                if (result == '是') {
                    deleteDB();
                    createDB();
                    addDatas();
                }
                $("#Set_dataDownLoad").removeClass("Set_Content_Select_Option_Selected");
            }
            md.commands.append(cmd);
        }
        //显示弹出框
        md.showAsync();
        
    }


    
})();