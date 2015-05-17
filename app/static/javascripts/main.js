$(document).ready(function(){
	L.Icon.Default.imagePath = APP_IMAGES_URL;
	var map = L.map('map').setView([48.1333, 11.5667], 13);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(map);
	
	var markers = new L.MarkerClusterGroup();
    markers.fadedOut = false;

    markers.fadeOut = function(){
        if(!markers.fadedout){
            markers.eachLayer(function(marker){
                marker.setOpacity(0.5);
            })
            markers.fadedout = true;
        }
    }
    
    markers.fadeIn = function(){
        if(markers.fadedout){
            markers.eachLayer(function(marker){
                marker.setOpacity(1);
            })
            markers.fadedout = false;
        }
    }
	loadMapFragment();
	map.addLayer(markers);
    
    // Initialise the FeatureGroup to store editable layers
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: false,
            circle: false,
            rectangle: false,
        },
    });
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        var type = e.layerType,
        layer = e.layer;
        markers.fadeOut();
        drawnItems.addLayer(layer);
    }); 
    
	$.ajax({
		url : "/powerlines",
		success : function(data){
			for(var i = 0; i < data.length; i++){
				var polyline = L.polyline(data[i], {color: 'red'}).addTo(map);
			}
		}
	});

    map.on('moveend', function(){
        loadMapFragment();
    });

	function loadMapFragment(){
        if(map.getZoom() > 11) {
            $.ajax({
                url : "/points",
                data: {
                    "bounds" : map.getBounds().toBBoxString() 
                },
                success : function(data){
                    markers.clearLayers();
                    var newMarkers = []
                    for(var i = 0; i < data.length; i++){
                        var marker = new L.Marker(data[i]['latlng']);
                        marker.bindPopup(markerPopupContent(data[i]))
                        newMarkers.push(marker);
                    }			
                    markers.addLayers(newMarkers);
                }
            });
        }
    }

    function markerPopupContent(point){
        var popupContent = "<b>Name:</b> " + point['name'];
        popupContent += "<br />";
        popupContent += "<b>Latitude:</b> " + point['latlng'][0];
        popupContent += "<br />";
        popupContent += "<b>Longitude:</b> " + point['latlng'][1];
        popupContent += "<br />";
        popupContent += "<b>Tags:</b> " + JSON.stringify(point['tags'], null, 4);
        var popup = L.popup({ autopan: false })
            .setContent(popupContent);
        return popup;
    }


});
