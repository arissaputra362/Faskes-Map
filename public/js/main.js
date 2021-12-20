// Atrribut openstreetmap
var mbAttr =
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// URL openstreetmap
var mbUrl =
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

// Grayscale map
var grayscale = L.tileLayer(mbUrl, {
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mbAttr,
});

// Streets map
var streets = L.tileLayer(mbUrl, {
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mbAttr,
});

// Layer Grup
var legends = L.layerGroup();

// Maps
var map = L.map("map", {
    center: curLocation,
    zoom: 14,
    layers: [streets, legends],
});

// Base Layer
var baseLayers = {
    Grayscale: grayscale,
    Streets: streets,
};

// Overlay (simbol)
var overlays = {
    Legends: legends,
};

// Add layer to map
var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

// Add pop up content
function onEachFeature(feature, layer) {
    var popupContent = "";

    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }

    layer.bindPopup(popupContent);
}

// Hospital icon Marker
var hospitalIcon = L.icon({
    iconUrl: "/icon/hospital.png",
    iconSize: [38, 38],
    popupAnchor: [0, -10],
});

// Pin Your Location icon Marker
var pinIcon = L.icon({
    iconUrl: "/icon/pin.png",
    iconSize: [38, 38],
    popupAnchor: [0, -10],
});

// Default hidden input value to get Current Position coordinates
$("#longitude").val(curLocation[1]);
$("#latitude").val(curLocation[0]);

// Your location Marker
var marker = new L.marker(curLocation, {
    draggable: "true",
    icon: pinIcon,
    zIndexOffset: 250,
    riseOnHover: true,
})
    .addTo(map)
    .bindPopup("Lokasi Anda")
    .openPopup();

// Your location Circle Area
var circle = new L.circle(curLocation, {
    color: "#0a8",
    fillColor: "#0f9",
    fillOpacity: 0.2,
    radius: 1000,
})
    .addTo(map)
    .bringToBack();

// Get Circle Center coordinates and radius
var circleCenter = circle.getLatLng();
var circleRadius = circle.getRadius();

// Check user GPS Position
map.on("locationfound", function (ev) {
    // Set marker and circle area coordinates to user gps coordinates
    marker.setLatLng(ev.latlng, {
        draggable: "true",
    });
    circle.setLatLng(ev.latlng);

    // Set circle center to circle coordinates
    circleCenter = circle.getLatLng();

    // Set new current location to marker location
    newCurr = marker.getLatLng();

    // Check faskes in current circle area
    insideCircle(hospitalLayer, circleCenter, circleRadius);

    // Set new hidden input value
    $("#longitude").val(newCurr.lng);
    $("#latitude").val(newCurr.lat).trigger("change");
});

// Locate map to current User GPS Coordinates
map.locate({ setView: true, maxZoom: 17 });

// Get All Faskes Data and set map legends(point)
var hospitalPoint = L.geoJSON([hospitals], {
    style: function (feature) {
        return feature.properties && feature.properties.style;
    },

    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#0ea",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
        });
    },
}).addTo(legends);

// Set Closest Faskes Icon with hospital icon
var hospitalLayer = L.geoJSON([hospitals], {
    style: function (feature) {
        return feature.properties && feature.properties.style;
    },

    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: hospitalIcon,
        });
    },
});

// Save tempt routing destination
var tempWay;

// Routing function from pin to faskes
function routing(pinLatLng, hospitalLatLng) {
    if (tempWay) {
        map.removeControl(route);
    }

    route = L.Routing.control({
        waypoints: [L.latLng(pinLatLng), L.latLng(hospitalLatLng)],
    }).addTo(map);

    // Set tempt with hospital coordinates
    tempWay = hospitalLatLng;
}

// Set new current coordinates with marker coordinates
newCurr = marker.getLatLng();

// Data List on click event to route from user location to faskes location
function focusOn(id) {
    hospitalLayer.eachLayer(function (layer) {
        if (id == layer.feature.id) {
            layer.addTo(legends).openPopup();
            routing(newCurr, layer.getLatLng());
        }
    });
}

// Button set location click event
function findMe() {
    // remove routing
    if (tempWay) {
        map.removeControl(route);
    }

    // Check user GPS Position
    map.on("locationfound", function (ev) {
        // Set marker and circle area coordinates to user gps coordinates
        marker.setLatLng(ev.latlng, {
            draggable: "true",
        });
        circle.setLatLng(ev.latlng);

        // Set circle center to circle coordinates
        circleCenter = circle.getLatLng();

        // Set new current location to marker location
        newCurr = marker.getLatLng();

        // Check faskes in current circle area
        insideCircle(hospitalLayer, circleCenter, circleRadius);

        // Set new hidden input value
        $("#longitude").val(newCurr.lng);
        $("#latitude").val(newCurr.lat).trigger("change");
    });

    // Locate map to current User GPS Coordinates
    map.locate({ setView: true, maxZoom: 17 });
}

// Function to check if faskes inside circle area
function insideCircle(layer, center, radius) {
    var closest = 0;
    obj = [];
    layer.eachLayer(function (layer) {
        // Get layer coordinates
        layerLatLng = layer.getLatLng();

        // Distance layer from circle
        distance = layerLatLng.distanceTo(center);

        // Checking...
        if (distance <= radius) {
            // Send Layer Data to data list
            obj.push({ id: layer.feature.id, jarak: distance });
            if (closest == 0 || closest > distance) {
                closest = distance;
                // open closest faskes with user position pop up
                layer.addTo(legends).openPopup();
            }
            // add hospital pin when faskes inside circle area
            layer.addTo(legends);
        } else {
            // remove popup and faskes pin when faskes outside circle area
            layer.closePopup().remove();
        }
    });
}

// Execute check faskes inside circle area
insideCircle(hospitalLayer, circleCenter, circleRadius);

// Event when Marker drag
marker.on("dragend", function (event) {
    // Remove routing
    if (tempWay) {
        map.removeControl(route);
    }

    // coordinates to execute in this function while pin location dragging
    var position = marker.getLatLng();

    marker
        .setLatLng(position, {
            draggable: "true",
        })
        .openPopup()
        .update();

    newCurr = marker.getLatLng();
    circle.setLatLng(position);

    circleCenter = circle.getLatLng();
    circleRadius = circle.getRadius();

    // Check faskes inside circle area
    insideCircle(hospitalLayer, circleCenter, circleRadius);

    // Update current location value to get Data
    $("#longitude").val(position.lng);
    $("#latitude").val(position.lat).trigger("change");
});

function onMapClick(e) {
    // remove routing
    if (tempWay) {
        map.removeControl(route);
    }

    // coordinates to execute in this function
    var position = e.latlng;

    marker
        .setLatLng(position, {
            draggable: "true",
        })
        .openPopup()
        .update();

    newCurr = marker.getLatLng();
    console.log(newCurr);
    circle.setLatLng(position);

    circleCenter = circle.getLatLng();
    circleRadius = circle.getRadius();

    // Check faskes inside circle area
    insideCircle(hospitalLayer, circleCenter, circleRadius);

    // Update current location value to get Data
    $("#longitude").val(position.lng);
    $("#latitude").val(position.lat).trigger("change");
}

// Execute function when map on click
map.on("click", onMapClick);
