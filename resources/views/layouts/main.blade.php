<!DOCTYPE html>
<html>

<head>

    <title>Faskmap | Faskes Map Mojokerto</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
        integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">


    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin="" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />

    <link rel="stylesheet" href="">

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>


    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <style>
        html,
        body {
            height: 100%;
            margin: 0;
        }

        #map {
            width: 100%;
            height: 100vh;
        }
    </style>


</head>

<body>

    @yield('content')

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous">
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
        integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.min.js"
        integrity="sha384-VHvPCCyXqtD5DqJeNxl2dtTyhF78xXNXdkwX1CZeRusQfRKp+tA7hAShOK/B/fQ2" crossorigin="anonymous">
    </script>

    <script>
        const latitude = document.querySelector("#latitude");
        const longitude = document.querySelector("#longitude");
        const locationInput = document.querySelector("#location");

        // Default Current Location
        var curLocation = [-7.536792685362514, 112.69293264345234];

        // New Location, change every event
        var newCurr;

        // Object pass to php controller
        var obj = [];

        // Get Data Faskes from php controller
        var hospitals = {
            "type": "FeatureCollection",
            "features": [
                @foreach ($hospitalData as $hospital)
                    <?php echo json_encode($hospital); ?>,
                @endforeach
            ]
        };

        var roadway = {
            "type": "FeatureCollection",
            "features": [
                @foreach ($roadData as $road)
                    <?php echo json_encode($road); ?>,
                @endforeach
            ]
        }

        // Get Data Area Mojokerto from php controller
        var areas = {
            "type": "FeatureCollection",
            "features": [
                @foreach ($areaData as $area)
                    <?php echo json_encode($area); ?>,
                @endforeach
            ]
        };

        // Event On load page
        window.addEventListener('load', function() {
            if (newCurr) {
                curLocation[0] = newCurr.lat;
                curLocation[1] = newCurr.lng;
            }
            obj.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            var lat = curLocation[0];
            var lng = curLocation[1];
            var myJson = JSON.stringify(obj);

            // Get Closest From Position Faskes Data List
            $.ajax({
                url: "/getFaskes",
                type: "GET",
                dataType: "json",
                data: {
                    action: "exec_find",
                    data: myJson,
                },
                success: function(data) {
                    // continue program
                    if (data) {
                        $('#faskes').empty();
                        $.each(data.d, function(key, d) {
                            $('#faskes').append(
                                '<li class="list-group-item bg-costum" onclick="focusOn(' +
                                d.id +
                                ')" style="cursor: pointer"><b>' + d
                                .nama + '</b><br>' +
                                ((d.no) ? d.no : '-') + '<br>' + d.alamat + '</li>'
                            );
                        });
                    } else {
                        $('#faskes').empty();
                    }
                },
                error: function(log) {
                    // handle error
                },
            });

            // Get Current Location Data
            fetch('/getLoct?lat=' + lat + '&lng=' + lng)
                .then(response => response.json())
                .then(data => {
                    locationInput.value = data.location
                });
        });


        // Observer to execute hidden input change
        var observer = new MutationObserver(function(mutations, observer) {
            if (mutations[0].attributeName == "value") {
                $(latitude).change();
            }
        });
        observer.observe(latitude, {
            attributes: true
        });

        // Hidden input change event
        $(latitude).change('change', function() {
            obj.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            var lat = latitude.value;
            var lng = longitude.value;
            console.log(obj);
            var myJson = JSON.stringify(obj);

            // Get Closest From Position Faskes Data List
            $.ajax({
                url: "/getFaskes",
                type: "GET",
                dataType: "json",
                data: {
                    action: "exec_find",
                    data: myJson,
                },
                success: function(data) {
                    // continue program
                    if (data) {
                        $('#faskes').empty();
                        $.each(data.d, function(key, d) {
                            $('#faskes').append(
                                '<li class="list-group-item bg-costum" onclick="focusOn(' +
                                d.id +
                                ')" style="cursor: pointer"><b>' + d
                                .nama + '</b><br>' +
                                ((d.no) ? d.no : '-') + '<br>' + d.alamat + '</li>'
                            );
                        });
                    } else {
                        $('#faskes').empty();
                    }
                },
                error: function(log) {
                    // handle error
                },
            });

            // GEt Current Location Data
            fetch('/getLoct?lat=' + lat + '&lng=' + lng)
                .then(response => response.json())
                .then(data => {
                    locationInput.value = data.location
                });
        });
    </script>

    <script src="/js/main.js"></script>
</body>

</html>
