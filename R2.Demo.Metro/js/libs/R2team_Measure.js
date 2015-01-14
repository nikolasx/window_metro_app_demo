/*------------------------全局定义-----------------------------*/
window.RRteam = {};

//Rrteam.Control = OpenLayers.Class(Rrteam, {
//});

RRteam.Control = {};
RRteam.Marker = {};

/*---------------------------------------------------------测量控件（长度和面积）---------------------------------------------------------*/

/**
* Class: Zondy.Marker.Text
*
* Inherits from:
*  - <OpenLayers.Marker> 
*/
RRteam.Marker.Text = OpenLayers.Class(OpenLayers.Marker, {

    /** 
    * Property: lonLat 
    * {<OpenLayers.LonLat>} 
    */
    lonLat: null,

    /** 
    * Property: lonLat 
    * {<String>}(Html内容)
    */
    content: "",

    /** 
    * Property: size 
    * {<OpenLayers.Size>}
    */
    size: null,

    /** 
    * Property: div
    * {DOMElement}
    */
    div: null,

    /**
    * APIProperty: tolerance
    * {int}(私有)
    */
    tolerance: 7,

    /** 
    * Constructor: Zondy.Marker.Text
    *
    * Parameters:
    * lonLat - {<OpenLayers.LonLat>} 
    * borderColor - {String} 
    * borderWidth - {int} 
    */
    initialize: function (lonLat, content, size, borderColor, borderWidth) {
        this.lonLat = lonLat;
        this.content = content;
        this.size = size;
        this.div = OpenLayers.Util.createDiv();
        this.div.style.overflow = 'hidden';
        this.div.style.backgroundColor = '#EDEDED';
        this.div.style.textAlign = "center";
        this.div.style.fontSize = "12";
        this.div.className = 'ZondyMarkerTextDiv';

        this.events = new OpenLayers.Events(this, this.div, null);
        this.setBorder(borderColor, borderWidth);
    },

    /**
    * Method: destroy 
    */
    destroy: function () {

        this.bounds = null;
        this.div = null;

        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
    },

    /** 
    * Method: setBorder
    * Allow the user to change the box's color and border width
    * 
    * Parameters:
    * color - {String} Default is "#949494"
    * width - {int} Default is 1
    */
    setBorder: function (color, width) {
        if (!color) {
            color = "#949494";
        }
        if (!width) {
            width = 1;
        }
        this.div.style.border = width + "px solid " + color;
    },

    /** 
    * Method: draw
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    * sz - {<OpenLayers.Size>} 
    * 
    * Returns: 
    * {DOMElement} A new DOM Image with this marker icon set at the 
    *         location passed-in
    */
    draw: function (px) {
        px = px.add(this.tolerance, 0);
        if (!this.size) {
            this.size = new OpenLayers.Size(80, 20);
        }
        OpenLayers.Util.modifyDOMElement(this.div, null, px, this.size);
        this.div.innerHTML = this.content;

        return this.div;
    },

    /**
    * Method: display
    * Hide or show the icon
    * 
    * Parameters:
    * display - {Boolean} 
    */
    display: function (display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "RRteam.Marker.Text"
});

/**
* Class: Zondy.Texts
* Draw divs as 'Texts' on the layer. 
*
* Inherits from:
*  - <OpenLayers.Layer.Markers>
*/
RRteam.Texts = OpenLayers.Class(OpenLayers.Layer.Markers, {

    /**
    * Constructor: Zondy.Texts
    *
    * Parameters:
    * name - {String}
    * options - {Object} Hashtable of extra options to tag onto the layer
    */
    initialize: function (name, options) {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, arguments);
    },

    /** 
    * Method: drawMarker 
    * Calculate the pixel location for the marker, create it, and
    *    add it to the layer's div
    *
    * Parameters: 
    * marker - {<Zondy.Marker.Text>}
    */
    drawMarker: function (marker) {
        var lonLat = marker.lonLat;
        var location = this.map.getLayerPxFromLonLat(lonLat);
        if (location == null) {
            marker.display(false);
        } else {
            var markerDiv = marker.draw(location);
            if (!marker.drawn) {
                this.div.appendChild(markerDiv);
                marker.drawn = true;
            }
        }
    },


    /**
    * APIMethod: removeMarker 
    * 
    * Parameters:
    * marker - {<OpenLayers.Marker.Box>} 
    */
    removeMarker: function (marker) {
        OpenLayers.Util.removeItem(this.markers, marker);
        if ((marker.div != null) &&
            (marker.div.parentNode == this.div)) {
            this.div.removeChild(marker.div);
        }
    },

    CLASS_NAME: "RRteam.Texts"
});

/**
* Class: Zondy.Control.Measure
* Allows for drawing of features for measurements.
*
* Inherits from:
*  - <OpenLayers.Control>
*/
RRteam.Control.Measure = OpenLayers.Class(OpenLayers.Control, {
    /*
    *  墨卡托转换
    */
    Mercator:111319.490777,

    /** 
    * APIProperty: handlerOptions
    * {Object} Used to set non-default properties on the control's handler
    */
    handlerOptions: null,

    /**
    * Property: callbacks
    * {Object} The functions that are sent to the handler for callback
    */
    callbacks: null,

    /**
    * Property: displaySystem
    * {String} Display system for output measurements.  Supported values
    *     are 'english', 'metric', and 'geographic'.  Default is 'metric'.
    */
    displaySystem: 'metric',

    /**
    * Property: geodesic
    * {Boolean} Calculate geodesic metrics instead of planar metrics.  This
    *     requires that geometries can be transformed into Geographic/WGS84
    *     (if that is not already the map projection).  Default is false.
    */
    geodesic: false,

    /**
    * Property: displaySystemUnits
    * {Object} Units for various measurement systems.  Values are arrays
    *     of unit abbreviations (from OpenLayers.INCHES_PER_UNIT) in decreasing
    *     order of length.
    */
    displaySystemUnits: {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm']
    },

    /**
    * Property: delay
    * {Number} Number of milliseconds between clicks before the event is
    *     considered a double-click.  The "measurepartial" event will not
    *     be triggered if the sketch is completed within this time.  This
    *     is required for IE where creating a browser reflow (if a listener
    *     is modifying the DOM by displaying the measurement values) messes
    *     with the dblclick listener in the sketch handler.
    */
    partialDelay: 100,

    /**
    * Property: delayedTrigger
    * {Number} Timeout id of trigger for measurepartial.
    */
    delayedTrigger: null,

    /**
    * APIProperty: persist
    * {Boolean} Keep the temporary measurement sketch drawn after the
    *     measurement is complete.  The geometry will persist until a new
    *     measurement is started, the control is deactivated, or <cancel> is
    *     called.
    */
    persist: true,

    /** 
    * Property: texts
    * {<Zondy.Texts>}(私有)
    */
    texts: null,

    /** 
    * Property: closeMarkers
    * {<OpenLayers.Layer.Markers>}(私有)
    */
    closeMarkers: null,

    /**
    * APIProperty: tolerance
    * {int}(私有)
    */
    tolerance: 15,
    /**
    * APIProperty: stat
    * {Array}(私有)
    */
    stat: null,

    /**
    * APIProperty: order
    * {int}(私有)
    */
    order: null,

    /**
    * APIProperty: measureLayer
    * {OpenLayers.Layer.Vector}(私有)
    */
    measureLayer: null,

    /**
    * APIProperty: immediate
    * {Boolean} Activates the immediate measurement so that the "measurepartial"
    *     event is also fired once the measurement sketch is modified.
    *     Default is false.
    */
    immediate: false,

    /**
    * Constructor: Zondy.Control.Measure
    * 
    * Parameters:
    * handler - {<OpenLayers.Handler>} 
    * options - {Object} 
    */
    initialize: function (handler, options) {

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        var callbacks = {
            done: this.measureComplete,
            point: this.measurePartial
        };
        if (this.immediate) {
            callbacks.modify = this.measureImmediate;
        }
        this.callbacks = OpenLayers.Util.extend(callbacks, this.callbacks);
        /// no clicked
        this.clicked = false;
        //measure layer style
        this.measureStyles = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                pointRadius: "${type}", // sized according to type attribute
                fillColor: "#CAFF70",
                fillOpacity: 0.3,
                strokeColor: "#ff9933",
                strokeWidth: 2,
                graphicZIndex: 1
            })
        });

        // style the sketch fancy
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "#556B2F",
                fillOpacity: 0.5,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#8B814C",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3,
                strokeDashstyle: "dash"
            }
        };
        this.style = new OpenLayers.Style();
        this.style.addRules([
                new OpenLayers.Rule({ symbolizer: sketchSymbolizers })
        ]);
        var styleMap = new OpenLayers.StyleMap({ "default": this.style });
        // let the handler options override, so old code that passes 'persist' 
        // directly to the handler does not need an update
        this.handlerOptions = OpenLayers.Util.extend(
            {
                persist: this.persist, layerOptions: { styleMap: styleMap }
            }, this.handlerOptions
        );
        this.handler = new handler(this, this.callbacks, this.handlerOptions);

    },
    /**
    * APIMethod: activate
    */
    draw: function (px) {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        //this.div.style.border = "solid red 1px";
        //this.div.style.backgroundColor = "#E2ECFA";
        //this.div.style.fontSize = "12";

        //when first click,we can draw it

        if (this.clicked) {
            if (this.handler.CLASS_NAME.indexOf('Path') > -1) {//measure length
                this.div.innerHTML = "";
                var element = document.createElement("div");
                //change units
                this.changeUnits();
                element.innerHTML = "总长: <b><font style='color:red'>" + this.stat[0].toFixed(2) + "</font></b>" + this.stat[1] + "<br>单击确定地点，双击结束";
                this.div.appendChild(element);
            } else { //measure area
                this.div.innerHTML = "";
                var element = document.createElement("div");
                //change units
                this.changeUnits();
                element.innerHTML = "当前面积: <b><font style='color:red'>" + this.stat[0].toFixed(2) + "</font></b>平方" + this.stat[1] + "<br>单击确定地点，双击结束";
                this.div.appendChild(element);
            }
        }
        if (!this.clicked) {
            //this.div.appendChild(document.createTextNode("单击确定起点"));
            this.div.appendChild(document.createTextNode(""));
            this.map.events.register('mouseover', this, this.showDiv);
            this.map.events.register('mouseout', this, this.hideDiv);
        }
        //first create measure layer
        if (!this.measureLayer) {
            this.measureLayer = new OpenLayers.Layer.Vector("measureLayer", {
                styleMap: this.measureStyles
            });
            this.map.addLayer(this.measureLayer);
        }
        //first create texts layer
        if (!this.texts) {
            this.texts = new RRteam.Texts("measureTexts");
            this.map.addLayer(this.texts);
            this.pointIndex = 0;
        }
        //first create close marker layer
        if (!this.closeMarkers) {
            this.closeMarkers = new OpenLayers.Layer.Markers("measureClose");
            this.map.addLayer(this.closeMarkers);
        }
        return this.div;
    },
    /** 
    * Method: showDiv
    *  show the div
    */
    showDiv: function (evt) {

        this.div.style.left = evt.xy.x + this.tolerance + "px";
        this.div.style.top = evt.xy.y + this.tolerance + "px";
        this.div.style.display = "";
    },
    /** 
    * Method: hideDiv
    *  hide the div
    *
    */
    hideDiv: function () {
        //Hide div
        this.div.style.display = "none";
    },
    /** 
    * Method: changeDiv
    *  change the div
    *
    */
    changeDivContent: function () {
        this.clicked = true;
        this.div.innerHTML = "";
        this.draw();
        this.div.style.display = "";
    },
    /**
    * APIMethod: activate
    */
    activate: function () {
        return OpenLayers.Control.prototype.activate.apply(this, arguments);
    },

    /**
    * APIMethod: deactivate
    */
    deactivate: function () {
        this.cancelDelay();
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },

    /**
    * APIMethod: cancel
    * Stop the control from measuring.  If <persist> is true, the temporary
    *     sketch will be erased.
    */
    cancel: function () {
        this.cancelDelay();
        this.handler.cancel();
    },

    /**
    * APIMethod: setImmediate
    * Sets the <immediate> property. Changes the activity of immediate
    * measurement.
    */
    setImmediate: function (immediate) {
        this.immediate = immediate;
        if (this.immediate) {
            this.callbacks.modify = this.measureImmediate;
        } else {
            delete this.callbacks.modify;
        }
    },
    /**
    * APIMethod: changeUnits
    * change units
    */
    changeUnits: function () {
        //change units
        if (this.stat) {
            if (this.stat[1] == "km") {
                this.stat[1] = "公里";
            } else if (this.stat[1] == "m") {
                this.stat[1] = "米";
            }
        }
    },
    /**
    * Method: updateHandler
    *
    * Parameters:
    * handler - {Function} One of the sketch handler constructors.
    * options - {Object} Options for the handler.
    */
    updateHandler: function (handler, options) {
        var active = this.active;
        if (active) {
            this.deactivate();
        }
        this.handler = new handler(this, this.callbacks, options);
        if (active) {
            this.activate();
        }
    },

    /**
    * Method: measureComplete
    * Called when the measurement sketch is done.
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    */
    measureComplete: function (geometry) {
        this.cancelDelay();
        this.measure(geometry);
        var geoObj = geometry.components;
        //change units
        this.changeUnits();
        var feature = new OpenLayers.Feature.Vector(geometry);
        this.measureLayer.addFeatures([feature]);
        if (geometry.CLASS_NAME.indexOf('LineString') > -1) {
            this.lonLat = new OpenLayers.LonLat(geoObj[geoObj.length - 1].x, geoObj[geoObj.length - 1].y);
            //add text
            var content = "<font style='color:#474747'>总长: </font><b><font style='color:red'>" + this.stat[0].toFixed(2) + "</font></b>" + "<font style='color:#474747'>" + this.stat[1]+"</font>";
            var text = new RRteam.Marker.Text(this.lonLat, content, new OpenLayers.Size(150, 20));
            this.texts.addMarker(text);

        } else {
            var geoPoly = geoObj[0].components;
            this.lonLat = new OpenLayers.LonLat(geoPoly[geoPoly.length - 2].x, geoPoly[geoPoly.length - 2].y);
            //add text
            var content = "<font style='color:#474747'>总面积:</font> <b><font style='color:red'>" + this.stat[0].toFixed(2) + "</font></b><font style='color:#474747'>平方" + this.stat[1] + "</font>";
            var text = new RRteam.Marker.Text(this.lonLat, content, new OpenLayers.Size(200, 20));
            this.texts.addMarker(text);
        }
        //add close marker
        var imageLoaction = OpenLayers.Util.getImagesLocation();
        var close = new OpenLayers.Marker(this.lonLat, new OpenLayers.Icon("../images/close.png", new OpenLayers.Size(15, 20)));
        var flag = 0;
        close.events.register('click', this, function (event) {
            flag++;
            if (flag < 2) return;
            this.measureLayer.removeFeatures([feature]);
            this.closeMarkers.clearMarkers();
            this.texts.clearMarkers();
            this.map.removeLayer(this.measureLayer);
            this.map.removeLayer(this.closeMarkers);
            this.map.removeLayer(this.texts);
        });


        close.events.register('mouseover', this, function () {
            close.icon.imageDiv.style.cursor = "pointer";
            close.icon.imageDiv.title = "清除本次测量";
        });
        this.closeMarkers.addMarker(close);

        //Complete
        this.map.events.unregister('mouseover', this, this.showDiv);
        this.map.events.unregister('mouseout', this, this.hideDiv);
        this.div.innerHTML = "";
        this.hideDiv();
        this.deactivate();
    },

    /**
    * Method: measurePartial
    * Called each time a new point is added to the measurement sketch.
    *
    * Parameters:
    * point - {<OpenLayers.Geometry.Point>} The last point added.
    * geometry - {<OpenLayers.Geometry>} The sketch geometry.
    */
    measurePartial: function (point, geometry) {
        //point.x = 0;
        //point.y = 0;
        this.cancelDelay();
        geometry = geometry.clone();

        // when we're wating for a dblclick, we have to trigger measurepartial
        // after some delay to deal with reflow issues in IE
        if (this.handler.freehandMode(this.handler.evt)) {
            // no dblclick in freehand mode
            this.measure(geometry);
            if (geometry.CLASS_NAME.indexOf('LineString') > -1) {//measure length
                var geoObj = geometry.components;
                //change units
                this.changeUnits();
                if (this.pointIndex == 0) {
                    var lonLat = new OpenLayers.LonLat(geoObj[0].x, geoObj[0].y);
                    var text = new RRteam.Marker.Text(lonLat, "<b><font style='color:#5E5E5E'>起点", new OpenLayers.Size(50, 20));
                    this.texts.addMarker(text);
                    this.pointIndex++;
                } else {
                    var lonLat = new OpenLayers.LonLat(geoObj[this.pointIndex].x, geoObj[this.pointIndex].y);
                    var content = "<b><font style='color:red'>" + this.stat[0].toFixed(2) + "</font></b>" + this.stat[1];
                    var text = new RRteam.Marker.Text(lonLat, content, new OpenLayers.Size(80, 20));
                    this.texts.addMarker(text);
                    this.pointIndex++;
                }
            } else {//measure area
                this.pointIndex++;
            }

        } else {
            this.delayedTrigger = window.setTimeout(
                OpenLayers.Function.bind(function () {
                    this.delayedTrigger = null;
                    this.measure(geometry);
                    var geoObj = geometry.components;
                    //change units
                    this.changeUnits();
                    if (geometry.CLASS_NAME.indexOf('LineString') > -1) {//measure length

                        if (this.pointIndex == 0) {
                            var lonLat = new OpenLayers.LonLat(geoObj[0].x, geoObj[0].y);
                            var text = new RRteam.Marker.Text(lonLat, "<b><font style='color:#5E5E5E'>起点", new OpenLayers.Size(50, 20));
                            this.texts.addMarker(text);
                            this.pointIndex++;
                        } else {
                            var lonLat = new OpenLayers.LonLat(geoObj[this.pointIndex].x, geoObj[this.pointIndex].y);
                            var content = "<b><font style='color:red'>" + this.stat[0].toFixed(2) + "</font></b><font style='color:#5E5E5E'>" + this.stat[1] + "</font>";
                            var text = new RRteam.Marker.Text(lonLat, content, new OpenLayers.Size(100, 20));
                            this.texts.addMarker(text);
                            this.pointIndex++;
                        }
                    } else {//measure area
                        this.pointIndex++;
                    }

                }, this),
                this.partialDelay
            );
        }
    },

    /**
    * Method: measureImmediate
    * Called each time the measurement sketch is modified.
    * 
    * Parameters: point - {<OpenLayers.Geometry.Point>} The point at the
    * mouseposition. feature - {<OpenLayers.Feature.Vector>} The sketch feature.
    */
    measureImmediate: function (point, feature, drawing) {
        if (drawing && this.delayedTrigger === null &&
                                !this.handler.freehandMode(this.handler.evt)) {
            this.measure(feature.geometry);
            //change main div
            this.changeDivContent();
        }
    },

    /**
    * Method: cancelDelay
    * Cancels the delay measurement that measurePartial began.
    */
    cancelDelay: function () {
        if (this.delayedTrigger !== null) {
            window.clearTimeout(this.delayedTrigger);
            this.delayedTrigger = null;
        }
    },

    /**
    * Method: measure
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    * eventType - {String}
    */
    measure: function (geometry) {
        var order;
        if (geometry.CLASS_NAME.indexOf('LineString') > -1) {
            this.stat = this.getBestLength(geometry);
            this.order = 1; //测量距离
        } else {
            this.stat = this.getBestArea(geometry);
            this.order = 2; //测量面积
        }
    },

    /**
    * Method: getBestArea
    * Based on the <displaySystem> returns the area of a geometry.
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    *
    * Returns:
    * {Array([Float, String])}  Returns a two item array containing the
    *     area and the units abbreviation.
    */
    getBestArea: function (geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, area;
        for (var i = 0, len = units.length; i < len; ++i) {
            unit = units[i];
            area = this.getArea(geometry, unit);
            if (area > 1) {
                break;
            }
        }
        return [area, unit];
    },

    /**
    * Method: getArea
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    * units - {String} Unit abbreviation
    *
    * Returns:
    * {Float} The geometry area in the given units.
    */
    getArea: function (geometry, units) {
        var area, geomUnits;
        if (this.geodesic) {
            area = geometry.getGeodesicArea(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            area = geometry.getArea();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if (inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
        }
        return area/(this.Mercator*this.Mercator)*1.609*1.609;
    },

    /**
    * Method: getBestLength
    * Based on the <displaySystem> returns the length of a geometry.
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    *
    * Returns:
    * {Array([Float, String])}  Returns a two item array containing the
    *     length and the units abbreviation.
    */
    getBestLength: function (geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, length;
        for (var i = 0, len = units.length; i < len; ++i) {
            unit = units[i];
            length = this.getLength(geometry, unit);
            if (length > 1) {
                break;
            }
        }
        return [length, unit];
    },

    /**
    * Method: getLength
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    * units - {String} Unit abbreviation
    *
    * Returns:
    * {Float} The geometry length in the given units.
    */
    getLength: function (geometry, units) {
        var length, geomUnits;
        if (this.geodesic) {
            length = geometry.getGeodesicLength(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            length = geometry.getLength();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if (inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length/this.Mercator*1.609;
    },

    CLASS_NAME: "RRteam.Control.Measure"
});
