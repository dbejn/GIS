
var from_projection = new OpenLayers.Projection("EPSG:4326"); // WGS 1984
var to_projection = new OpenLayers.Projection("EPSG:3857"); // Spherical Mercator Projection EPSG:3857
var map, select_control;

function init() {

	map = new OpenLayers.Map("map", {projection: to_projection});

	// aerial view layer
	var aerial_layer = new OpenLayers.Layer.Bing({
		
		key: "AkUWS_xEpaweLqLGnt5_iqduiRN3T1pI6mEAjwCvI-jDutPHKeTnh5Ps9ix4_P_Z", 
		type: "Aerial"
	});
	map.addLayer(aerial_layer);
	map.setCenter(new OpenLayers.LonLat(21.892547, 43.331502).transform(from_projection, to_projection), 17);
	
	// roads layer     
	var roads_layer = new OpenLayers.Layer.WMS(
	
		"WMS", 
		"http://localhost:8080/geoserver/gis_homework/wms",
		{
			LAYERS: 'gis_homework:serbia_osm_roads', transparent: true
		},
		{
			/*sphericalMercator: true,
			wrapDateLine: true,*/
			numZoomLevels: 20, 
			singleTile: false, // true
			isBaseLayer: false // true
		}
	);
	map.addLayer(roads_layer);
	
	// lines layer
	var lines_layer = new OpenLayers.Layer.Vector(
		
		"Lines Layer", 
		{
			strategies: [new OpenLayers.Strategy.BBOX()], 
			protocol: new OpenLayers.Protocol.WFS({
				
				version: "1.1.0", 
				url: "http://localhost:8080/geoserver/wfs", 
				featurePrefix: "gis_homework", 
				featureType: "serbia_osm_line", 
				featureNS: "http://localhost:8080/geoserver/gis_homework", 
				geometryName: "way", 
				srsName: "EPSG:3857"
			}), 
			filter: new OpenLayers.Filter.Comparison({
				
				type: OpenLayers.Filter.Comparison.LIKE, 
				property: "highway", 
				value: "*"
			}), 
			styleMap: new OpenLayers.StyleMap({
					
				"default": new OpenLayers.Style({
					
					strokeWidth: 2,
					strokeColor: "#EBB434"
				})
			})
		}
	);
	map.addLayer(lines_layer);
	
	/*var lines_layer = new OpenLayers.Layer.WMS(
	
		"WMS", 
		"http://localhost:8080/geoserver/gis_homework/wms",
		{
			LAYERS: 'gis_homework:serbia_osm_line', transparent: true
		},
		{
			/*sphericalMercator: true,
			wrapDateLine: true,
			numZoomLevels: 18, 
			singleTile: false, // true
			isBaseLayer: false // true
		}
	);
	map.addLayer(lines_layer);*/
	
	// buildings layer
	var buildings_layer = new OpenLayers.Layer.Vector(
		
		"Buildings Layer", 
		{
			strategies: [new OpenLayers.Strategy.BBOX()], 
			protocol: new OpenLayers.Protocol.WFS({
				
				version: "1.1.0", 
				url: "http://localhost:8080/geoserver/wfs", 
				featurePrefix: "gis_homework", 
				featureType: "serbia_osm_polygon", 
				featureNS: "http://localhost:8080/geoserver/gis_homework", 
				geometryName: "way", 
				srsName: "EPSG:3857"
			}), 
			filter: new OpenLayers.Filter.Comparison({
				
				type: OpenLayers.Filter.Comparison.LIKE, 
				property: "building", 
				value: "*"
			}), 
			styleMap: new OpenLayers.StyleMap({
				
				"default": new OpenLayers.Style({
					
					strokeWidth: 2, 
					strokeColor: "#FF5C00", 
					fillColor: "#FFC3A1", 
					fillOpacity: 0.6
				})
			})
		}
	);
	map.addLayer(buildings_layer);
	
	// poi layer
	var poi_layer = new OpenLayers.Layer.Vector(
		
		"POI Layer", 
		{
			strategies: [new OpenLayers.Strategy.BBOX()], 
			protocol: new OpenLayers.Protocol.WFS({
				
				version: "1.1.0", 
				url: "http://localhost:8080/geoserver/wfs", 
				featurePrefix: "gis_homework", 
				featureType: "serbia_osm_point", 
				featureNS: "http://localhost:8080/geoserver/gis_homework", 
				geometryName: "way",  
				srsName: "EPSG:3857"
			}), 
			styleMap: new OpenLayers.StyleMap({
				
				"default": new OpenLayers.Style({
					
					pointRadius: 8, 
					fillColor: "#571B00", 
					pointRadius: 5,
					fillColor: "#E84800", 
					label : "${label}", 
					fontSize: "12px", 
					fontWeight: "bold", 
					labelYOffset: 15,
					labelOutlineColor: "white",
					labelOutlineWidth: 3
				}, 
				{
					context: {
						
						label: function(feature) {
							
							if (map.getZoom() >= 16) {
								
								return typeof feature.attributes.name === "undefined" ? "" : feature.attributes.name;
							}
							else {
								
								return "";
							}
						}
					}
				})
			})
		}
	);
	map.addLayer(poi_layer);
	
	// center the map
	// map.setCenter(new OpenLayers.LonLat(2250000, 5450000), 8);
	//map.setCenter(new OpenLayers.LonLat(21.892547, 43.331502).transform(from_projection, to_projection), 17);
	
	// poi popup
	select_control = new OpenLayers.Control.SelectFeature([map.layers[4], map.layers[3], map.layers[2]], 
		{onSelect: on_feature_select, onUnselect: on_feature_unselect});
	map.addControl(select_control);
	select_control.activate();
	
	// legend
	var roads_legend = document.createElement("img");
	roads_legend.src = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis_homework:serbia_osm_roads&legend_options=forceLabels:on;fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:14;bgColor:0xFFFFFF;dpi:120";
	roads_legend.style.margin = "10px";
	roads_legend.style.paddingRight = "100px";
	document.getElementById("legend").appendChild(roads_legend);
	
	var lines_legend = document.createElement("img");
	lines_legend.src = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis_homework:serbia_osm_line&legend_options=forceLabels:on;fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:14;bgColor:0xFFFFFF;dpi:120";
	lines_legend.style.margin = "10px";
	lines_legend.style.paddingRight = "100px";
	document.getElementById("legend").appendChild(lines_legend);
	
	var buildings_legend = document.createElement("img");
	buildings_legend.src = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis_homework:serbia_osm_polygon&legend_options=forceLabels:on;fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:14;bgColor:0xFFFFFF;dpi:120";
	buildings_legend.style.margin = "10px";
	buildings_legend.style.paddingRight = "100px";
	document.getElementById("legend").appendChild(buildings_legend);
	
	var points_legend = document.createElement("img");
	points_legend.src = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis_homework:serbia_osm_point&legend_options=forceLabels:on;fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:14;bgColor:0xFFFFFF;dpi:120";
	points_legend.style.margin = "10px";
	points_legend.style.paddingRight = "100px";
	document.getElementById("legend").appendChild(points_legend);
}

function on_popup_close(evt) {
	
	select_control.unselect(selected_feature);
}

function on_feature_unselect(feature) {
	
	map.removePopup(feature.popup);
	feature.popup.destroy();
	feature.popup = null;
}

function on_feature_select(feature) {
	
	var click_lon_lat = map.getLonLatFromPixel(
	
		new OpenLayers.Pixel(
			
			select_control.handlers.feature.evt.layerX, 
			select_control.handlers.feature.evt.layerY
		)
	);
	
	selected_feature = feature;
	popup = new OpenLayers.Popup.FramedCloud(
		
		"chicken", 
		click_lon_lat, 
		new OpenLayers.Size(100, 100), 
		"<h2>" + feature.attributes.name + "</h2>" + 
		(typeof feature.attributes.building === "undefined" ? "" : feature.attributes.building + " ") + 
		(typeof feature.attributes.amenity === "undefined" ? "" : feature.attributes.amenity + " ") + 
		(typeof feature.attributes.shop === "undefined" ? "" : feature.attributes.shop + " ") + 
		(typeof feature.attributes.historic === "undefined" ? "" : feature.attributes.historic + " ") + 
		(typeof feature.attributes.highway === "undefined" ? "" : feature.attributes.highway),
		null, 
		true, 
		on_popup_close
	);
	
	feature.popup = popup;
	map.addPopup(popup, true);
}
