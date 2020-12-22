$(() => {
    /* Map ******************************************************************************************/
    initmap();
    $('#show-sidebar').on('click', () => {
        $('#sidebar').addClass('show-sidebar').removeClass('hide-sidebar');
    });
    
    $('.basemap').on('change', (e) => {
        switchBaseLayer(e.target.value);
    });

    $('#locate').on('click', () => {
        locateUser();
    });

    $('.site-img-link').on('click',  () => {
        alert('ok')
        // $('#image-pane').append($('<img>', {"src": feature.geometry.coordinates[0]}));
    });

    $('.next').on('click', () => {
        $('.image-count').text(parseInt($('.image-count').text()) + 1);
        $('.site-image').attr('src', feature.properties.images[parseInt($('.image-count').text())]);
    });

    $('.prev').on('click', () => {
        $('.site-image').attr('src', feature.properties.images[parseInt($('.image-count').text()) - 2]);
    });

    // map.on('zoomend', function() {
    //     let currentZoom = map.getZoom();
    //     circle.setRadius(currentZoom);
    // });

    /* Sidebar ******************************************************************************************/

    $('.hide-sidebar').on('click', () => {
        $('#sidebar').addClass('hide-sidebar').removeClass('show-sidebar');
    });

    $('#map').on('click', () => {
        $('#sidebar').addClass('hide-sidebar').removeClass('show-sidebar');
    })

});

let initmap = () => {
    // Initialise map
    map = L.map('map').setView([-15.40669, 28.28713], 16);
    $('.leaflet-control-attribution' ).css('display', 'none');

    // Initialise base layers
    streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    });

    streets.addTo(map);

    // Initialise marker
    marker = L.marker();
    circle = L.circle();

    // Initialise baseLayer to googleStreets, so that the default layer is googleStreets
    // baseLayer = googleStreets;
    // baseLayer.addTo(map)

    /*  Map controls positioning 
    --------------------------------------------------------------------------------------------*/
    addControlPlaceholders(map);

    // Change the position of the Zoom Control to a newly created placeholder.
    map.zoomControl.setPosition('verticalcenterright');

    createIconClass();
    addOverlays();
}

let createIconClass = () => {
    roadSignIcon = L.Icon.extend({
        options: {
            iconSize:     [40, 44],
            iconAnchor:   [20, 44],
            popupAnchor:  [0, -44]
        }
    });
}

let addOverlays = async () => {
    try {
        let overlays = await getOverlays();
        L.geoJSON(overlays.features, { onEachFeature: onEachFeature});
    } catch(err) {
        console.log(err);
    }
}

let getOverlays = async () => {
    try {
        let res = await fetch('/assets/json/main.json');
        let overlays = await res.json();
        return overlays;
    } catch(err) {
        console.log(err);
    }
}

let onEachFeature = async (feature, layer) => {
    try {
        let icon = new roadSignIcon({iconUrl: '/assets/img/icons/road-signs/full-closure.svg'});
        layer.setIcon(icon).addTo(map);
        layer.on('click', async (e) => {
            let res = await fetch('/assets/htm/map/popup.html');
            let popupDoc = await res.text();

            layer.bindPopup(popupDoc);
            layer.openPopup();
            $('.sitename').text(feature.properties.name);
            $('.site-coords').text(feature.geometry.coordinates[1] + '\t' + feature.geometry.coordinates[0]);
            $('.site-image').attr('src', feature.properties.images[0]);

            let $roads = $('.roads'),
                $road = null;

            if(feature.properties.affectedRoads[0]) {
                feature.properties.affectedRoads.forEach(road => {
                    
                    $road = $('<li>', {"class": 'list-group-item'});
                    $road.text(road);
                    console.log(road)
                    $roads.append($listItem);
                });
            }
        });
    } catch(err) {
        console.log(err);
    }
}

// Create additional Control placeholders
function addControlPlaceholders(map) {
    var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
}

/**********************************************************************************************
 * Switch basemaps
 **********************************************************************************************/

let switchBaseLayer = (selectedLayer) => {
    // if (baseLayer) {
    //     map.removeLayer(baseLayer);
    // }

    // baseLayer = selectedLayer === 'streets' ? googleStreets
    // : selectedLayer === 'satellite' ? googleSat
    // : selectedLayer === 'hybrid' ? googleHybrid
    // : googleTerrain;

    // map.addLayer(baseLayer);
  }


let locateUser = () => {
    map.locate({
        setView: true, 
        watch: true
    }).on('locationfound', (e) => {
        map.removeLayer(marker);
        let icon = new roadSignIcon({iconUrl: '/resources/images/icons/road-signs/current-location.svg'});
        marker = L.marker(e.latlng).setIcon(icon).addTo(map);
        let circle = L.circle(e.latlng, e.accuracy/2, {
            weight: 1,
            color: 'blue',
            fillColor: '#cacaca',
            fillOpacity: 0.2
        }).addTo(map);
        map.setView([e.latitude, e.longitude], 16)
    });
  }


/* Sidebar ******************************************************************************************/

$('.hide-sidebar').on('click', () => {
  $('#sidebar').addClass('sidebar-hide').removeClass('sidebar-show');
  $('.overlay').addClass('hide').removeClass('show');
});


$('.overlay').on('click', () => {
  $('#sidebar').addClass('sidebar-hide').removeClass('sidebar-show');
  $('.overlay').addClass('hide').removeClass('show');
});

$('form').on('submit', function(e) {
    e.preventDefault();
    selectFormHandler(this);
});

// $('#nav-dd-btn').on('click', showNotifications);