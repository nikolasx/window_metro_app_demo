

//获取当前经纬度坐标
function getCurrentPosition(callback) {
    var position = new Windows.Devices.Geolocation.Geolocator();
    var promise = position.getGeopositionAsync();
    promise.done(function (pos) {
        var coord = pos.coordinate;
        var latitude = coord.latitude;    //经度
        var longitude = coord.longitude;    //纬度
        var accuracy = coord.accuracy;  //精度
        var ans= {
            latitude: latitude,
            longitude: longitude,
            accuracy:accuracy
        };
        callback(ans);
    }, function (error) {
        callback(null);
    });

}