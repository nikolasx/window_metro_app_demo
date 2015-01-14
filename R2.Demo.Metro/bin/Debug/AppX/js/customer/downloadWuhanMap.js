//从GIS服务器下载瓦片保存为jpg图片到本地文件夹，加载显示

//全局变量，存放对象，对象包含解析后的请求URL，该URL对应的级数、行列号信息
var wmyRESTUrlArray = [];
//全局变量，指代URL的总条数
var wtotalCount;
//全局变量，指代当前正在发送的URL在数组中的位置
var wnowCount = 0;
//全局变量

//方法：获取瓦片信息，调用解析函数，启动下载进程

function downloadWuhanMap() {
    //首先获取瓦片信息
    var url = "http://192.168.83.185/r2rest/Handler.ashx?method=GetHDFInfo&gisip=192.168.83.185&gisport=6163&hdfname=wuhan";
    var time = new Date();
    var timestr = time.getHours().toString() + ":" + time.getMinutes().toString() + ":" + time.getSeconds().toString();
    //document.getElementById("dbName").innerText = "begin:" + timestr;
    showDownloadingMessage();
    WinJS.xhr({ url: url, responseType: "JSON" }).then(
        function complete(result) {
            if (result.status === 200) {
                //取得服务器返回信息，序列化为对象
                var obj = eval(result.response);
                //将对象传递给下一步进行处理
                AnalyseWuhanHDFInfo(obj);
                wtotalCount = wmyRESTUrlArray.length;
                DownloadWuhanIMG();
            }
        },
        function error(e) {
            WinJS.log && WinJS.log("Enter the full url to get hdfinfo", "sample", "error");
        }
   )
}

//方法：正在下载提示信息显示
var interval1;
function showDownloadingMessage() {
    $("#Set_mapDownLoad_Message").show();
    $("#cover2").show();
    interval1 = setInterval(DownloadingMessage, "500");
}

//方法：正在下载提示信息
var PointerCount = 0;
function DownloadingMessage() {
    $("#Set_mapDownLoad_Message").append(".");
    PointerCount++;
    if (PointerCount > 3) {
        PointerCount = 0;
        $("#Set_mapDownLoad_Message").html("地图正在下载，请稍候");
    }
}

//方法：解析瓦片信息，并拼接下载URL、行列号及级数信息到对象，将对象保存在全局变量中
function AnalyseWuhanHDFInfo(obj) {
    var LevelCount = 9;
    for (var i = 0; i < LevelCount; i++) {
        var levelNow = obj[i].Level;
        var rowLimitNowLevel = obj[i].RowLimit;
        var colLimitNowLevel = obj[i].ColLimit;
        for (var m = 0; m < rowLimitNowLevel; m++) {
            for (var n = 0; n < colLimitNowLevel; n++) {
                //rest原始
                //http://192.168.83.185:6163/igs/rest/mrms/map/DLWIN8?row=0&col=0&lvl=0
                var objHere = { url: "http://192.168.83.185:6163/igs/rest/mrms/map/wuhan?row=" + m + "&col=" + n + "&lvl=" + levelNow + "&f=png", l: levelNow, r: m, c: n };
                //中转
                //var objHere = {url:"http://192.168.83.185/r2rest/Handler.ashx?method=GetSingleHDF&gisip=192.168.83.185&gisport=6163&hdfname=wuhan&l=" + levelNow + "&r=" + m + "&c=" + n,l:levelNow,r:m,c:n};
                wmyRESTUrlArray.push(objHere);
            }
        }
    }
}

//方法：下载图片主函数，启动后，通过循环递归调用自身来发送所有请求。递归条件为请求数目最大值以内
function DownloadWuhanIMG() {
    if (wnowCount < wtotalCount) {
        var url = wmyRESTUrlArray[wnowCount].url;
        WinJS.xhr({ url: url, responseType: "blob" }).then(
           function complete(result) {
               if (result.status === 200) {
                   WriteWuhanIMGToFolder(result.response, wmyRESTUrlArray[wnowCount].l, wmyRESTUrlArray[wnowCount].r, wmyRESTUrlArray[wnowCount].c);
                   wnowCount++;
                   DownloadWuhanIMG();
                   //下载进度条
                   var progressObj = $("#myprogress");
                   var oldValue = progressObj.attr("value");
                   progressObj.attr("value", oldValue + parseFloat(100 / wtotalCount));
                   $("#mapDownLoadCount").html(Math.ceil(oldValue));
               } else {
                   wnowCount++;
                   DownloadWuhanIMG();
               }
           },
           function error(e) {
               WinJS.log && WinJS.log("Enter the full url to an image", "sample", "error");
               wnowCount++;
               DownloadWuhanIMG();
           }
        );
    } else {
        var time1 = new Date();
        var timestr1 = time1.getHours() + ":" + time1.getMinutes() + ":" + time1.getSeconds();
        //document.getElementById("dbName").innerText = document.getElementById("dbName").innerText + "complete:" + timestr1;
        showDownloadCompleteMessage();
    }
}

//方法：下载完成提示信息显示
var interval2;
function showDownloadCompleteMessage() {
    fileState = 1;  //已经下载地图数据
    //新加载地图数据
    map.setCenter(new OpenLayers.LonLat(13532544.35, 4717170.15), 3);
    $("#Set_mapDownLoad_Message").html("下载完成，本提示将在5秒后消失");
    clearInterval(interval1);
    time = 5;
    interval2 = setInterval(DownloadCompleteMessage, "1000");
}

//方法：下载完成提示消失
var time;
function DownloadCompleteMessage() {
    time--;
    $("#Set_mapDownLoad_Message").html("下载完成，本提示将在" + time + "秒后消失");
    if (time == 0) {
        clearInterval(interval2);
        $("#Set_mapDownLoad_Message").html("地图正在下载，请稍后");
        $("#cover2").hide();
        $("#Set_mapDownLoad_Message").hide();
        $("#schedule").hide();
    }
}


//方法：将下载到的图片写入指定文件夹
function WriteWuhanIMGToFolder(blob, l, r, c) {
    Windows.Storage.ApplicationData.current.localFolder.createFolderAsync("wuhanMap", Windows.Storage.CreationCollisionOption.openIfExists).then(function (folder) {
        folder.createFolderAsync("IMG" + l, Windows.Storage.CreationCollisionOption.openIfExists).then(function (_1stChildFolder) {
            _1stChildFolder.createFolderAsync("Row" + r, Windows.Storage.CreationCollisionOption.openIfExists).then(function (_2ndChildFolder) {
                _2ndChildFolder.createFileAsync(r + "_" + c + ".png", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                    file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
                        var input = blob.msDetachStream();
                        Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                            output.flushAsync().done(function () {
                                input.close();
                                output.close();
                                WinJS.log && WinJS.log("File '" + file.name + "' saved successfully to the Pictures Library!", "sample", "status");
                            });
                        });
                    });
                });
            });
        });
    });
}

//方法：清空当前存在的地图文件
function DeleteWuhanIMGFolder() {
    Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("wuhanMap").then(
        function complete(folder) {
            folder.deleteAsync(Windows.Storage.StorageDeleteOption.permanentDelete).then(function () {
                return "Data deletion has completed.";
            });
        });
}

