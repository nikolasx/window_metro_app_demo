/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />

(function () {
    "use strict";
    var nav = WinJS.Navigation;
    var btnDelete;                     //确定删除记录
    var infoShowListView;        //infoShowListView对象
    var listViewItems;

    var page = WinJS.UI.Pages.define("/html/disasterInfoShow.html", {
        ready: function (element, options) {
            initFunction();                      //初始化AppBar  & listview事件 方法      
            getListViewDataSouce();    //加载listview列表数据
        },
        unload: function () {

        }
    });

    //快捷检索
    function getValueListView(value) {

    }
    //获取indexeddb中的数据  listview的 数据源
    function getListViewDataSouce() {
        //定义一个 Binding.List 用于绑定 listview的 数据源
        var items = [];

        //获得上报的数据（括号内的第一第二参数为引索和值）
        getZqsbData("", "", function (values) {
            if (values.length > 0) {
                for (var i = 0; i < values.length; i++) {
                    var data = values[i];
                    var obj = {
                        "objId": data.ID,
                        "area": data.区,
                        "disType": data.灾害类型,
                        "pop": data.受伤人数,
                        "street": data.街道,
                        "guimo": data.灾害规模,
                        "level": data.灾害等级,
                        "color": getColorByType(data.灾害类型)
                    };
                    items.push(obj);
                }
                //将读到的数据填充到Binding.List中，并作为infoShowListView的数据源
                listViewItems = new WinJS.Binding.List(items);
                infoShowListView.itemDataSource = listViewItems.dataSource;
            }
            else {

            }
        });
    }

    //根据灾害类型获得listviewitem的颜色
    function getColorByType(type) {
        var corlor = "";
        switch (type) {
            case "滑坡":
                corlor = "#444899";
                break;
            case "地面塌陷":
                corlor = "#488DE1";
                break;
            case "泥石流":
                corlor = "#D78818";
                break;
            case "崩塌":
                corlor = "#0B8496";
                break;
            case "地裂缝":
                corlor = "#1475B2";
                break;
            case "地面沉降":
                corlor = "#2E7D62";
                break;
            default:
                break;
        }
        return corlor;
    }

    //定义listviewitem & appbar 等 的事件 方法
    function initFunction() {
        // Register the selection changed event
        infoShowListView = document.querySelector("#infoShowListView").winControl;
        infoShowListView.addEventListener("selectionchanged", selectionChangedHandler, false);

        //应用栏按钮事件
        //查看详情
        var showDetail = document.getElementById("btnShowSbItemDetail").winControl;
        showDetail.addEventListener("click", doShowSbItemDetail, false);
        //删除
        var btnDelete = document.getElementById("btnDeletSbItem").winControl;
        btnDelete.addEventListener("click", createDataDeletePopusMessage, false);

        //刷新列表事件
        var reFreshBtn = document.getElementById("reloadZhRecords");
        reFreshBtn.addEventListener("click", getListViewDataSouce, false);

    }

    //listview的items选择事件
    function selectionChangedHandler(evt) {
        //选中的条数
        var count = infoShowListView.selection.count();
        if (count > 0) {
            if (count > 1) {
                appBar.hideCommands(appBarHost.querySelectorAll('#btnShowSbItemDetail'));
                appBar.hideCommands(appBarHost.querySelectorAll('#btnShowSbItemSeper'));
            }
                //只选中一条时，将查询按钮和分隔线隐藏
            else {
                appBar.showCommands(appBarHost.querySelectorAll('#btnShowSbItemDetail'));
                appBar.showCommands(appBarHost.querySelectorAll('#btnShowSbItemSeper'));
            }
            appBar.sticky = true;        //是否只有从底部或者头部滑过才能隐藏它，点击其他地方不会隐藏
            appBar.show();                 //显示AppBar
        }
        else {
            appBar.sticky = false;
            appBar.hide();
        }
    }

    //弹出删除警告框
    function createDataDeletePopusMessage() {
        var md = new Windows.UI.Popups.MessageDialog('选中的灾害数据都将被删除，是否删除?', '提示');
        var result, resultOptions = ['删除', '取消'];
        var cmd;
        for (var i = 0; i < resultOptions.length; i++) {
            cmd = new Windows.UI.Popups.UICommand();
            cmd.label = resultOptions[i];
            cmd.invoked = function (c) {
                result = c.label;
                if (result == '删除') {
                    doDeletSbItem();
                } else {
                    doClickClearSelection();
                }
            }
            md.commands.append(cmd);
        }
        //显示弹出框
        md.showAsync();
    }
    // 灾情查看
    function doShowSbItemDetail() {
        //获得选中的item在listview的 下标
        var indices = infoShowListView.selection.getIndices();
        if (indices.length > 0) {
            //获得选中的id
            var selectId = getSelecedListViewItem(indices);
            if (selectId.length > 0) {
                /*单页导航
                * html/disasterInfoDetail.html     页面相对Default.html 路径
                * SelectId: selectId                       参数的名称 和 参数值
                */
                nav.navigate("html/disasterInfoDetail.html", { SelectId: selectId[0] });
                appBar.hide();
                doClickClearSelection();   //清除 listview选择
            }
        }
    }


    //取消选择
    function doClickClearSelection() {
        infoShowListView.selection.clear();
    }

    // 删除记录
    function doDeletSbItem() {
        //从数据库删除数据
        if (infoShowListView.selection.count() > 0) {
            var indices = infoShowListView.selection.getIndices();
            var idArr = getSelecedListViewItem(indices);
            for (var i = indices.length - 1; i >= 0; i--) {
                listViewItems.splice(indices[i], 1);
                deleteRecordByUniqueId(idArr[i], function (data) { });
            }
        }
    }


    //获得选中项的内容
    function getSelecedListViewItem(indicesArr) {
        //获得选中项的ID[实际上为一个div的值]
        var idArr = [];
        if (indicesArr.length > 0) {
            for (var i = 0; i < indicesArr.length; i++) {
                //根据下标获得id
                var currentItemId = infoShowListView.selection.getItems()._value[i].data.objId;
                idArr.push(currentItemId);
            }
        }
        return idArr;
    }

    //显示警告框
    function showMessageBox() {

    }

})();