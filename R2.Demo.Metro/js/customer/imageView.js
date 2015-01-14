(function () {
    var page = WinJS.UI.Pages.define("/html/imageView.html", {
        ready: function (element, options) {
            //接收上个页面传过的 参数 并根据参数 加载详细信息
            //传进来的为用;隔开的图片名称字符串和文件夹字符串
            /***
               {picName:"",fileFold:""}
            */
            var pic = options.picName.split(";");
            var fileFold = options.fileFold;
            for (var i = 0; i < pic.length; i++) {
                $("#picContainer").append("<img class='imageViewPic'>");
            }
            $("#picContainer").css("width", 1366 * pic.length + "px");
            $("#imageViewBox").scrollLeft(1366 * options.imgSelected);
            $(".imageViewPic").css({ "width": "1346px", "height": "748px", "float":"left","display":"block","padding":"10px" });
            //打开文件
            Windows.Storage.ApplicationData.current.localFolder.getFolderAsync(fileFold).then(function (fileFold) {
                imageViewPic(fileFold,pic,0);
            });
            //返回键事件注册按钮
            $("#imageViewBack").click(function () {
                if (options.flag=="InputInfo") {
                    appBar.disabled = false;
                    $("#secondClassPages").css("width", "0");
                    $("#initPage").css("width", "100%");
                } else {
                    WinJS.Navigation.back();
                }
            });
        },
        unload: function () {
        }
    });
    //为了消除异步机制的影响，采用递归方法
    function imageViewPic(fileFold, pic, index) {
        if (index < pic.length) {
            fileFold.getFileAsync(pic[index]).then(function (file) {
                photoBlobUrl = URL.createObjectURL(file, { oneTimeOnly: true });
                $(".imageViewPic").eq(index).attr("src", photoBlobUrl);
                return imageViewPic(fileFold,pic,index+1);
            });
        }
    }
})();