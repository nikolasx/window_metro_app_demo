var map;

function init() {
    map = new OpenLayers.Map("map", {
        maxExtent: new OpenLayers.Bounds(13149614.85, 4383204.95, 13775786.99, 5009377.09),
        theme: null,
        numZoomLevels: 10,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
        ]
    });
    //∂®“ÂÕﬂ∆¨Õº≤„
    var titleLayer = new Zondy.Map.TileLayer("ditu", "DaLianAll", {
        ip: '192.168.83.187',
        port: '6163',
        transitionEffect: 'resize'
    });
    map.addLayers([titleLayer]);
    map.setCenter(new OpenLayers.LonLat(13532544.35, 4717170.15), 3);
}
