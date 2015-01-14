
var SdkSample = {};
SdkSample.db = null;
var newCreate = false;
var disArr = [];//灾害点信息

function createDB() {
    var dbRequest = window.indexedDB.open("SampleDb", 1);

    dbRequest.onerror = function () {

    };

    dbRequest.onupgradeneeded = function (evt) {
        dbVersionUpgrade(evt);
    };

    dbRequest.onsuccess = function (evt) {
        // Log whether the app tried to create the database when it already existed. 
        if (!newCreate) {
            // Close this additional database request
            var db = evt.target.result;
            db.close();

            WinJS.log && WinJS.log("Database schema already exists.", "sample", "error");
            return;
        }
    }

    newCreate = false;
}

function dbVersionUpgrade(evt) {

    // If the database was previously loaded, close it. 
    // Closing the database keeps it from becoming blocked for later delete operations.
    if (SdkSample.db) {
        SdkSample.db.close();
    }
    SdkSample.db = evt.target.result;

    // Get the version update transaction handle, since we want to create the schema as part of the same transaction.
    var txn = evt.target.transaction;

    // Create the books object store, with an index on the book title. Note that we set the returned object store to a variable
    // in order to make further calls (index creation) on that object store.
    var bookStore = SdkSample.db.createObjectStore("disaster", { keyPath: "ID", autoIncrement: true });
    bookStore.createIndex("ID", "ID", { unique: true });
    bookStore.createIndex("name", "名称", { unique: false });
    bookStore.createIndex("type", "灾害类型", { unique: false });
    bookStore.createIndex("status", "目前稳定状态", { unique: false });
    bookStore.createIndex("street", "街道", { unique: false });
    bookStore.createIndex("lon", "经度", { unique: false });
    // Once the creation of the object stores is finished (they are created asynchronously), log success.
    txn.oncomplete = function () { WinJS.log && WinJS.log("Database schema created.", "sample", "status"); };
    newCreate = true;
}

function deleteDB() {

    // Close and clear the handle to the database, held in the parent SdkSample namespace.
    if (SdkSample.db) {
        SdkSample.db.close();
    }
    SdkSample.db = null;
    var dbRequest = window.indexedDB.deleteDatabase("SampleDb");
    dbRequest.onerror = function () {
        WinJS.log && WinJS.log("Error deleting database.", "sample", "error");
    };
    dbRequest.onsuccess = function () {
        WinJS.log && WinJS.log("Database deleted.", "sample", "status");
    };
    dbRequest.onblocked = function () {
        WinJS.log && WinJS.log("Database delete blocked.", "sample", "error");
    };
}
//最后一页之前的情况下，向indexeddb中添加数据
function startLoadData(url) {
    // Create the request to open the database, named BookDB, and if it doesn't exist, create it and immediately
    // upgrade to version 1.


    var dbRequest = window.indexedDB.open("SampleDb", 1);

    // Add asynchronous callback functions
    dbRequest.onerror = function () { WinJS.log && WinJS.log("Error opening database.", "sample", "error"); };
    dbRequest.onsuccess = function (evt) { downLoadData(evt, url); };
    dbRequest.onupgradeneeded = function (evt) { WinJS.log && WinJS.log("Database wrong version.", "sample", "error"); if (SdkSample.db) { SdkSample.db.close(); } };
    dbRequest.onblocked = function () { WinJS.log && WinJS.log("Database access blocked.", "sample", "error"); };
}
//最后一页的情况下，向indexeddb中添加数据
function startLoadData2(url) {
    // Create the request to open the database, named BookDB, and if it doesn't exist, create it and immediately
    // upgrade to version 1.


    var dbRequest = window.indexedDB.open("SampleDb", 1);

    // Add asynchronous callback functions
    dbRequest.onerror = function () { WinJS.log && WinJS.log("Error opening database.", "sample", "error"); };
    dbRequest.onsuccess = function (evt) { downLoadData2(evt, url); };
    dbRequest.onupgradeneeded = function (evt) { WinJS.log && WinJS.log("Database wrong version.", "sample", "error"); if (SdkSample.db) { SdkSample.db.close(); } };
    dbRequest.onblocked = function () { WinJS.log && WinJS.log("Database access blocked.", "sample", "error"); };
}
//最后一页之前的情况下，向indexeddb中添加数据
function downLoadData(evt, url) {
    WinJS.xhr({ url: url, responseType: "json" }).then(
        function (result) {
            if (result.status === 200) {
                SdkSample.db = evt.target.result;
                writeDataToDB(result.response, SdkSample.db);
            }
        },
        function () {
            function error(e) {
                WinJS.log && WinJS.log("Enter the full url to an image", "sample", "error");
            }
        }
    )
}
//最后一页的情况下，向indexeddb中添加数据
function downLoadData2(evt, url) {
    WinJS.xhr({ url: url, responseType: "json" }).then(
        function (result) {
            if (result.status === 200) {
                SdkSample.db = evt.target.result;
                writeDataToDB2(result.response, SdkSample.db);
            }
        },
        function () {
            function error(e) {
                WinJS.log && WinJS.log("Enter the full url to an image", "sample", "error");
            }
        }
    )
}

function getPage(callback) {
    var url = "http://192.168.83.185/r2rest/Handler.ashx?method=GetDisasterInfo&pagesize=10&page=1";
    WinJS.xhr({ url: url, responseType: "json" }).then(
        function(result) {
            if (result.status === 200) {
                var count = $.parseJSON(result.response).totalCount;
                var pages;
                if (count % 10 == 0) {
                    pages = parseInt(count / 10);
                } else {
                    pages = parseInt(count / 10) + 1;
                }
                callback(pages);
            }
        },
        function() {
            function error(e) {
                WinJS.log && WinJS.log("Enter the full url to an image", "sample", "error");
            }
        }
    );
}


//最后一页之前的情况下，向indexeddb中添加数据
function writeDataToDB(data, db) {
    var output = document.getElementById("progressOutput");
    var datas = $.parseJSON(data);
    var txn = db.transaction(["disaster"], "readwrite");
    txn.oncomplete = function () {
        WinJS.log && WinJS.log("Database populated.", "sample", "status");
    };
    txn.onerror = function (evt) {
        WinJS.log && WinJS.log("Unable to populate database or database already populated.", "sample", "error");
    };
    txn.onabort = function () {
        WinJS.log && WinJS.log("Unable to populate database or database already populated.", "sample", "error");
    };

    var disasterStore = txn.objectStore("disaster");
    var dataObj = datas.DisasterInfoList;
    var len = dataObj.length;
    for (var i = 0; i < len; i++) {
        var addResult = disasterStore.add(dataObj[i]);
        addResult.name = dataObj[i].名称;
        addResult.street = dataObj[i].街道;
        addResult.type = dataObj[i].灾害类型;
        addResult.id = dataObj[i].ID;
        addResult.onsuccess = function (e) {
            var event = e;
        }
        addResult.onerror = function () {
            WinJS && WinJS.log("Failed to add disater:" + this.name + "." + this.id, "sample", "error");
        }
    }
    // addMyData();
}
//最后一页的情况下，向indexeddb中添加数据
function writeDataToDB2(data, db) {
    var output = document.getElementById("progressOutput");
    var datas = $.parseJSON(data);
    var txn = db.transaction(["disaster"], "readwrite");
    txn.oncomplete = function () {
        WinJS.log && WinJS.log("Database populated.", "sample", "status");
    };
    txn.onerror = function (evt) {
        WinJS.log && WinJS.log("Unable to populate database or database already populated.", "sample", "error");
    };
    txn.onabort = function () {
        WinJS.log && WinJS.log("Unable to populate database or database already populated.", "sample", "error");
    };

    var disasterStore = txn.objectStore("disaster");
    var dataObj = datas.DisasterInfoList;
    var len = dataObj.length;
    for (var i = 0; i < len; i++) {
        var addResult = disasterStore.add(dataObj[i]);
        addResult.name = dataObj[i].名称;
        addResult.street = dataObj[i].街道;
        addResult.type = dataObj[i].灾害类型;
        addResult.id = dataObj[i].ID;
        addResult.onsuccess = function (e) {
            var event = e;
        }
        addResult.onerror = function () {
            WinJS && WinJS.log("Failed to add disater:" + this.name + "." + this.id, "sample", "error");
        }
    }
    getDataCount2();
    createDataDownloadCompleteMessage();
}


//数据下载完成弹出提示框
function createDataDownloadCompleteMessage() {
    var md = new Windows.UI.Popups.MessageDialog('请关闭提示框', '下载完成');
    var result, resultOptions = ['关闭'];
    var cmd;
    for (var i = 0; i < resultOptions.length; i++) {
        cmd = new Windows.UI.Popups.UICommand();
        cmd.label = resultOptions[i];
        cmd.invoked = function (c) {
            result = c.label;
            if (result == '是') {
            }
        }
        md.commands.append(cmd);
    }
    //显示弹出框
    md.showAsync();
}

function getSpecifyedDataByKey(key, callback) {
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        try {
            var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
            //var index = objectStore.index("名称");g
            var request = objectStore.get(key);
            //var request = objectStore.upperBound(key);
            //var index = objectStore.index("ID");
            //var request = IDBKeyRange.lowerBound(key)
            //index.openCursor(request).onsuccess = function (event) {
            //    var cursor = event.target.result;
            //    callback(cursor);
            //}
            request.onsuccess = function (evt) {
                callback(request.result);
            }
            request.onerror = function (evt) {
                var d = request.result;
            }
        } catch (e) {

        }
    }
}

//取得数据的值
function getZqsbData(key, indexName, callback) {
    var dbRequest = window.indexedDB.open("zqsbDB", 1);
    onSpecifyedDataBykeySuccess.callback = callback;
    onSpecifyedDataBykeySuccess.key = key;
    onSpecifyedDataBykeySuccess.indexName = indexName;
    dbRequest.onsuccess = onSpecifyedDataBykeySuccess;
}

//根据索引取值
function onSpecifyedDataBykeySuccess(evt) {
    var customers = [];
    var db = evt.target.result;
    try {
        var txn = db.transaction("zqsbtable", "readonly");
        txn.oncomplete = function (e) {
            if (customers.length != 0) {
                onSpecifyedDataBykeySuccess.callback(customers);
            }
        }
        if (onSpecifyedDataBykeySuccess.indexName == "") {

            //利用游标的方法，读取数据
            txn.objectStore("zqsbtable").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    customers.push(cursor.value);
                    cursor.continue();
                }
            }
        }
        else {
            var objectStore = db.transaction("zqsbtable").objectStore("zqsbtable");
            var index = objectStore.index(onSpecifyedDataBykeySuccess.indexName);
            index.get(onSpecifyedDataBykeySuccess.key).onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    customers.push(cursor);
                }
            }
        }

    } catch (e) {

    }

}

//根据ID唯一值删除记录
function deleteRecordByUniqueId(id, callBack) {
    var dbRequest = window.indexedDB.open("zqsbDB", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        var request = db.transaction(["zqsbtable"], "readwrite").objectStore("zqsbtable");
        request.delete(id).onsuccess = function () {
            callBack("true");
        }
        request.error = function (e) {

        }
    }
}

//获取数据库中的所有数据
function getAllData(callback) {
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    var ans = [];
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        try {
            var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    ans.push(cursor.value);
                    cursor.continue();
                } else {
                    callback(ans);
                }
            }
        } catch (e) {
        }
    }
}
//获取所有数据的灾害类型及街道
function getDisasterClass(callback) {
    var ans = [];
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        try {
            var objectStore = db.transaction(["disaster"], "readonly").objectStore("disaster");
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var value = {灾害类型:null,街道:null};
                    value.灾害类型 = cursor.value.灾害类型;
                    value.街道 = cursor.value.街道;
                    ans.push(value);
                    cursor.continue();
                } else {
                    callback(ans);
                }
            }
            objectStore.openCursor().onerror = function (event) {
                
            }
        } catch (error) {
        }
    }
    dbRequest.onerror = function (evt) {
        
    };
}
//获取符合街道，灾害类型条件的记录
function getData(streetType, disType, callback) {
    var sType = streetType.join("#");
    var dType = disType.join("#");
    var ans = [];
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        try {
            var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var regStreet = new RegExp(cursor.value.街道);
                    var regDisaster = new RegExp(cursor.value.灾害类型);
                    if (regStreet.test(sType) && regDisaster.test(dType)) {
                        ans.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    callback(ans);
                }
            }
        } catch (e) {
        }
    }
}
//数据库需要新建的情况下，在数据库建立后获取全部数据
function getDataCount2() {
    disArr = [];
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        try {
            var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
            var request = objectStore.count();
            request.onsuccess = function (evt) {
                var c = request.result;
                for (var i = 1 ; i <= c; i++) {
                    getSpecifyedDataByKey2(i);
                }
            }
            request.onerror = function (evt) {
                var d = request.result;
            }
        } catch (e) {

        }
    }
}

function getSpecifyedDataByKey2(key) {
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        try {
            var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
            //var index = objectStore.index("名称");g
            var request = objectStore.get(key);
            request.onsuccess = function (evt) {
                var d = request.result;
                var lon = d.经度;
                var lat = d.纬度;
                var lon2 = transform(lon);
                var lat2 = transform(lat);
                var mokatuolon = LonToMetersGCXZ(lon2);
                var mokatuolat = LatToMetersGCXZ(lat2);
                var obj = {
                    "objId": d.ID,
                    "lon": mokatuolon,
                    "lat": mokatuolat,
                    "name": d.名称,
                    "bianhao": d.统一编号,
                    "disType": d.灾害类型,
                    "pop": d.威胁人口,
                    "state": d.目前稳定状态,
                    "street": d.街道,
                    "xianming": d.县名
                };
                disArr.push(obj);
            }
            request.onerror = function (evt) {
                var d = request.result;
            }
        } catch (e) {

        }
    }
}

//将经纬度转换成度分秒形式
function transform(num) {
    var du = num.substring(0, num.length - 4);
    var fen = parseInt(num.substring(num.length - 4, num.length - 2));
    var miao = parseInt(num.substring(num.length - 2, num.length));
    var fen2 = fen / 60;
    var miao2 = miao / 3600;
    return Number(du) + Number(fen2) + Number(miao2);
}

var originShiftGCXZ = 2 * Math.PI * 6378137 / 2.0;
//将经纬度转换成墨卡托直角坐标
function LonToMetersGCXZ(lon) {
    return lon * originShiftGCXZ / 180.0;
}
function LatToMetersGCXZ(lat) {
    var y = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
    return y * originShiftGCXZ / 180.0;
}


function getSpecifyedDataOnIndex() {
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
        var index = objectStore.index("type");
        var request = index.get("危险斜坡");
        request.onsuccess = function (evt) {
            var d = request.result;
        }
        request.onerror = function (evt) {
            var d = request.result;
        }
    }
}

function indexCursor() {
    var dbRequest = window.indexedDB.open("SampleDb", 1);
    dbRequest.onsuccess = function (evt) {
        var db = evt.target.result;
        var objectStore = db.transaction(["disaster"], "readwrite").objectStore("disaster");
        var index = objectStore.index("name");
        var singleKeyRange = IDBKeyRange.only("稳定性差");
        var boundKeyRange = IDBKeyRange.bound("甘井子", "甘井子" + "\uffff");

        var request = index.openCursor(boundKeyRange, "prev");
        request.onsuccess = function (evt) {
            var cursor = evt.target.result;
            if (cursor) {
                var c = cursor;
                cursor.continue();
            }

        }
        request.onerror = function (evt) {
            var d = request.result;
        }
    }
}

