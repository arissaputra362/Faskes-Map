// Atrribut openstreetmap
var mbAttr =
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// URL openstreetmap
// var mbUrl =
//     "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

var mbUrl = "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
var mbUrlSatelit = "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
var mbUrlHybrid = "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";

// Grayscale map
var grayscale = L.tileLayer(mbUrlHybrid, {
    // id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    // attribution: mbAttr,
});

// Streets map
var streets = L.tileLayer(mbUrl, {
    // id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    // attribution: mbAttr,
});

// Streets map
var satelit = L.tileLayer(mbUrlSatelit, {
    // id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    // attribution: mbAttr,
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
    Satelit: satelit,
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

    layer.bindPopup(popupContent).on("popupopen", () => {
        $(".leaflet-popup").on("click", (e) => {
            focusOn(feature.id);
        });
    });
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

var smallCircle;
var routingLine;
let graphWeight = [];
var tempGraphLatLng = [];
// Save tempt routing destination
// var tempWay;
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

// Road Way Data Sidoarjo
var roadwayLine = L.geoJSON([roadway], {
    style: function (feature) {
        return feature.properties && feature.properties.style;
    },

    onEachFeature: onEachFeature,

    function(feature, latlng) {
        return L.polyline(latlng, {
            color: "#fff",
            opacity: 0,
        });
    },
});

// Routing function from pin to faskes
// function routing(pinLatLng, hospitalLatLng) {
//     if (tempWay) {
//         map.removeControl(route);
//     }

//     route = L.Routing.control({
//         waypoints: [L.latLng(pinLatLng), L.latLng(hospitalLatLng)],
//     }).addTo(map);

//     // Set tempt with hospital coordinates
//     tempWay = hospitalLatLng;
// }

// Set new current coordinates with marker coordinates
newCurr = marker.getLatLng();

// Data List on click event to route from user location to faskes location
function focusOn(id) {
    hospitalLayer.eachLayer(function (layer) {
        if (id == layer.feature.id) {
            layer.addTo(legends).openPopup();
            smallCircle = undefined;
            smallCircleRadius = newCurr.distanceTo(layer.getLatLng());
            smallCircle = new L.circle(newCurr, {
                radius: smallCircleRadius,
                fillOpacity: 0,
                opacity: 0,
            })
                .addTo(map)
                .bringToBack();

            insideSmallCircle(
                roadwayLine,
                smallCircle,
                newCurr,
                layer.getLatLng(),
                true
            );
        }
    });
}

function checkCoord(point) {
    if (typeof point == "string") {
        return JSON.parse(point);
    }
}

// Button set location click event
function findMe() {
    graphWeight = [];
    tempGraphLatLng = [];

    if (routingLine) {
        routingLine.remove();
        routingLine = undefined;
    }
    // remove routing
    // if (tempWay) {
    //     map.removeControl(route);
    // }

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

function insideSmallCircle(road, smallCircle, start, finish, line) {
    var closestStart;
    var closestFinish;
    var distanceToStart = 0;
    var distanceToFinish = 0;
    tempGraphLatLng = [];
    graphWeight = [];

    tempGraphLatLng.push(start);

    road.eachLayer(function (layer) {
        if (smallCircle.getBounds().intersects(layer.getBounds())) {
            temp = layer.getLatLngs();

            for (let e = 0; e < temp.length; e++) {
                if (e != temp.length - 1) {
                    if (
                        distanceToStart == 0 ||
                        distanceToStart > start.distanceTo(temp[e])
                    ) {
                        distanceToStart = start.distanceTo(temp[e]);
                        closestStart = temp[e];
                    }

                    if (
                        distanceToFinish == 0 ||
                        distanceToFinish > finish.distanceTo(temp[e])
                    ) {
                        distanceToFinish = finish.distanceTo(temp[e]);
                        closestFinish = temp[e];
                    }

                    tempGraphLatLng.push(temp[e]);
                    graphWeight.push([
                        temp[e],
                        temp[e + 1],
                        temp[e].distanceTo(temp[e + 1]),
                    ]);
                } else {
                    if (
                        distanceToStart == 0 ||
                        distanceToStart > start.distanceTo(temp[e])
                    ) {
                        distanceToStart = start.distanceTo(temp[e]);
                        closestStart = temp[e];
                    }

                    if (
                        distanceToFinish == 0 ||
                        distanceToFinish > finish.distanceTo(temp[e])
                    ) {
                        distanceToFinish = finish.distanceTo(temp[e]);
                        closestFinish = temp[e];
                    }

                    tempGraphLatLng.push(temp[e]);
                    graphWeight.push([
                        temp[e],
                        temp[e],
                        temp[e].distanceTo(temp[e]),
                    ]);
                }
            }
        }
    });

    graphWeight.unshift([start, closestStart, distanceToStart]);
    graphWeight.push([finish, closestFinish, distanceToFinish]);

    tempGraphLatLng.push(finish);

    if (line == true) {
        routingDijkstra(start, finish, line);
    } else {
        return routingDijkstra(start, finish, line);
    }
}

// Function to check if faskes inside circle area
function insideCircle(layer, center, radius) {
    var closest = 0;
    var newDistance;
    obj = [];

    layer.eachLayer(function (layer) {
        // Get layer coordinates
        layerLatLng = layer.getLatLng();

        // Distance layer from circle
        distance = layerLatLng.distanceTo(center);

        // Checking...
        if (distance <= radius) {
            smallCircle = undefined;
            smallCircleRadius = center.distanceTo(layerLatLng);
            smallCircle = new L.circle(center, {
                radius: smallCircleRadius,
                fillOpacity: 0,
                opacity: 0,
            })
                .addTo(map)
                .bringToBack();

            newDistance = insideSmallCircle(
                roadwayLine,
                smallCircle,
                center,
                layerLatLng,
                false
            );

            // console.log(newDistance);
            // Send Layer Data to data list
            obj.push({ id: layer.feature.id, jarak: newDistance });
            if (closest == 0 || closest > newDistance) {
                closest = newDistance;
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

// Event when Marker drag
marker.on("dragend", function (event) {
    graphWeight = [];
    tempGraphLatLng = [];

    if (routingLine) {
        routingLine.remove();
        routingLine = undefined;
    }
    // // Remove routing
    // if (tempWay) {
    //     map.removeControl(route);
    // }

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
    graphWeight = [];
    tempGraphLatLng = [];

    if (routingLine) {
        routingLine.remove();
        routingLine = undefined;
    }
    // // remove routing
    // if (tempWay) {
    //     map.removeControl(route);
    // }

    // coordinates to execute in this function
    var position = e.latlng;

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
}

function routingDijkstra(start, finish, line) {
    var graph;
    if (routingLine) {
        routingLine.remove();
        routingLine = undefined;
    }

    graph = new WeightedGrap();

    tempGraphLatLng.forEach((element) => {
        graph.addVertex(element);
    });

    graphWeight.forEach((element) => {
        graph.addEdge(element[0], element[1], element[2]);
    });

    let hasilDijkstra = graph.Dijkstra(start, finish);
    // console.log(hasilDijkstra);

    let newHasil = [];

    hasilDijkstra.forEach(function (ll) {
        if (typeof ll == "string") {
            console.log(ll);
            var latlng = ll.split(/, ?/);
            let el = L.latLng(
                parseFloat(latlng[0].match(/-?(?:\d+(?:\.\d*)?|\.\d+)/)),
                parseFloat(latlng[1])
            );
            ll = el;
        }
        newHasil.push(ll);
    });
    console.log(newHasil);

    if (line == true) {
        routingLine = new L.Polyline(newHasil, {
            color: "red",
            weight: 5,
            opacity: 0.5,
            smoothFactor: 1,
        });
        routingLine.addTo(legends);
    } else {
        var result = graphWeight;
        var faskesDistance = 0;
        var newGraph = [];
        result.forEach((element) => {
            // console.log(element);
            for (let i = 0; i < newHasil.length - 2; i++) {
                // console.log(newHasil[i]);
                if (
                    (element[0] == newHasil[i] &&
                        element[1] == newHasil[i + 1]) ||
                    (element[0] == newHasil[i + 1] && element[1] == newHasil[i])
                ) {
                    if (!newGraph.includes(element)) {
                        newGraph.push(element);
                        faskesDistance = faskesDistance + element[2];
                    }
                }
            }
        });
        return faskesDistance;

        // console.log(newGraph);
    }
}

// Execute function when map on click
map.on("click", onMapClick);

$("#slide-up").click(function () {
    $(".app-bar").height("90%");
    $(".card-body").height("100%");
    $("#slide-up").hide();
    $("#slide-down").show();
    $(".back").removeClass("hide-beranda");
});

$("#slide-down").click(function () {
    $("#slide-up").show();
    $("#slide-down").hide();
    $(".app-bar").height(150);
    $(".card-body").height(140);
    $(".back").addClass("hide-beranda");
});

$(document).ready(function () {
    $("#slide-down").hide();
    $(".back").addClass("hide-beranda");

    // Execute check faskes inside circle area
    insideCircle(hospitalLayer, circleCenter, circleRadius);
});

class WeightedGrap {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }

    Dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = [];
        let smallest;

        for (let vertex in this.adjacencyList) {
            if (vertex == start) {
                nodes.enqueue(vertex, 0);
                distances[vertex] = 0;
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }

            previous[vertex] = null;
        }

        while (nodes.values.length) {
            smallest = nodes.dequeue().val;
            if (smallest === finish) {
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }

            if (smallest || distances[smallest] != Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    // find neighbor node
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    // console.log(nextNode);

                    let candidate = distances[smallest] + nextNode.weight;
                    let nextNeighbor = nextNode.node;

                    if (candidate < distances[nextNeighbor]) {
                        distances[nextNeighbor] = candidate;

                        previous[nextNeighbor] = smallest;

                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
            // console.log(neg);
        }
        // console.log(whilee);

        return path.concat(smallest).reverse();
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }

    bubbleUp() {
        let idx = this.values.length - 1;
        const element = this.values[idx];

        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }

    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }

    sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];

        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;
            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }

            if (rightChild < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }

            if (swap === null) break;

            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

// class MinBinaryHeap {
//     constructor() {
//         this.values = [];
//     }

//     enqueue(val, priority) {
//         let newNode = new Node(val, priority);
//         this.values.push(newNode);
//         this.bubbleUp();
//     }

//     bubbleUp() {
//         // Referensikan ke element baru
//         let idx = this.values.length - 1;
//         const element = this.values[idx];

//         // Temukan element parent
//         while (idx > 0) {
//             let parentIdx = Math.floor((idx - 1) / 2);
//             let parent = this.values[parentIdx];
//             if (element.priority >= parent.priority) break;
//             this.values[parentIdx] = element;
//             this.values[idx] = parent;
//             idx = parentIdx;
//         }
//     }

//     dequeue() {
//         let min = this.values[0];
//         let end = this.values.pop();
//         if (this.values.length > 0) {
//             this.values[0] = end;
//             this.sinkDown();
//         }
//         return min;
//     }

//     sinkDown() {
//         let idx = 0;
//         const length = this.values.length; // Easier to reference length
//         const element = this.values[0];

//         while (true) {
//             let leftChildIdx = 2 * idx + 1;
//             let rightChildIdx = 2 * idx + 2;
//             let leftChild, rightChild;
//             let swap = null;

//             if (leftChildIdx < length) {
//                 leftChild = this.values[leftChildIdx];

//                 if (leftChild.priority < element.priority) {
//                     swap = leftChildIdx;
//                 }
//             }

//             if (rightChildIdx < length) {
//                 rightChild = this.values[rightChildIdx];

//                 if (
//                     (!swap && rightChild.priority < element.priority) ||
//                     (swap && rightChild.priority < leftChild.priority)
//                 ) {
//                     swap = rightChildIdx;
//                 }
//             }
//             if (!swap) break;
//             this.values[idx] = this.values[swap];
//             this.values[swap] = element;
//             idx = swap;
//         }
//     }
// }

// class WeightGraph {
//     constructor() {
//         this.adjacencyList = {};
//     }

//     addVertex(vertex) {
//         if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
//     }

//     addEdge(vertex1, vertex2, weight) {
//         this.adjacencyList[vertex1].push({ node: vertex2, weight: weight });
//         this.adjacencyList[vertex2].push({ node: vertex1, weight: weight });
//     }

//     removeEdge(v1, v2) {
//         this.adjacencyList[v1] = this.adjacencyList[v1].filter(
//             (el) => el !== v2
//         );
//         this.adjacencyList[v2] = this.adjacencyList[v2].filter(
//             (el) => el !== v1
//         );
//     }

//     removeVertex(vertex) {
//         while (this.adjacencyList[vertex].length) {
//             const adjacentVertex = this.adjacencyList[vertex].pop();
//             this.removeEdge(vertex, adjacentVertex);
//         }
//         delete this.adjacencyList[vertex];
//     }

//     DepthFirst(start) {
//         let stack = [start];
//         let result = [];
//         let visited = {};
//         let currentVertex;
//         visited[start] = true;

//         while (stack.length) {
//             currentVertex = stack.pop();
//             result.push(currentVertex);

//             this.adjacencyList[currentVertex].forEach((neighbor) => {
//                 if (!visited[neighbor]) {
//                     visited[neighbor] = true;
//                     stack.push(neighbor);
//                 }
//             });
//         }
//         return result;
//     }

//     Dijkstra(start, finish) {
//         const queue = new MinBinaryHeap();
//         const distances = {};
//         const previous = {};

//         let path = []; // to return at the end
//         let smallest;

//         for (let vertex in this.adjacencyList) {
//             if (vertex === start) {
//                 distances[vertex] = 0;
//                 queue.enqueue(vertex, 0);
//                 console.log("Vertex == start");
//                 console.log(vertex);
//             } else {
//                 distances[vertex] = Infinity;
//                 queue.enqueue(vertex, Infinity);
//                 console.log("Vertex else");
//                 console.log(vertex);
//             }
//             previous[vertex] = null;
//         }
//         console.log("Queue");
//         console.log(queue.values);
//         console.log(queue.values.length);
//         console.log("----------");
//         while (queue.values.length) {
//             smallest = queue.dequeue().val;
//             console.log("Smallest");
//             console.log(smallest);
//             if (smallest === finish) {
//                 console.log("Smallest == finish");
//                 while (previous[smallest]) {
//                     path.push(smallest);
//                     smallest = previous[smallest];
//                     console.log(previous[smallest]);
//                 }
//                 console.log("Smallest == finish end ");
//                 break;
//             }
//             if (smallest || distances[smallest] !== Infinity) {
//                 for (let neighbor in this.adjacencyList[smallest]) {
//                     let nextNode = this.adjacencyList[smallest][neighbor];
//                     let candidate = distances[smallest] + nextNode.weight;
//                     let neighborValue = nextNode.node;
//                     if (candidate < distances[neighborValue]) {
//                         // update 'distances' object
//                         distances[neighborValue] = candidate;
//                         // update 'previous' object
//                         previous[neighborValue] = smallest;
//                         // enqueue priority queue with new smallest distance
//                         queue.enqueue(neighborValue, candidate);
//                     }
//                 }
//             }
//         }
//         return path.concat(smallest).reverse();
//     }
// }
