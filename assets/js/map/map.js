import { showPopup } from "./show-popup.js";


const LUSAKA_COORDS = [-15.40669, 28.28713];

const LAYER_URLS = {
  streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const MAX_ZOOM = 19;


let map,
    streets,
    marker,
    circle,
    roadSignIcon;

const initMap = async () => {
  map = L.map('map').setView(LUSAKA_COORDS, 16);
  $('.leaflet-control-attribution' ).css('display', 'none');

  streets = L.tileLayer(LAYER_URLS.streets, { maxZoom: MAX_ZOOM });
  streets.addTo(map);
  
  marker = L.marker();
  circle = L.circle();

  // Map controls positioning 
  await addControlPlaceholders(map);

  // Change the position of the Zoom Control to a newly created placeholder.
  map.zoomControl.setPosition('verticalcenterright');

  roadSignIcon = await createIconClass();
  await addOverlays();
  await addEvents();
};

const createIconClass = async () => {
  return L.Icon.extend({
    options: {
      iconSize:     [40, 44],
      iconAnchor:   [20, 44],
      popupAnchor:  [0, -44]
    }
  });
};

const addOverlays = async () => {
  const overlays = await getOverlays();
  L.geoJSON(overlays.features, { onEachFeature });
};

const getOverlays = async () => (await fetch('/assets/json/main.json')).json();

const onEachFeature = async (feature, layer) => {
  let iconURL = feature.properties.passability === 'Fully Closed' ? "/assets/img/icons/road-signs/red-marker.svg"
  : feature.properties.passability === 'Partially Closed' ? "/assets/img/icons/road-signs/yellow-marker.svg"
  : feature.properties.passability === 'Open' ? "/assets/img/icons/road-signs/green-marker.svg"
  : "/assets/img/icons/road-signs/red-marker.svg";

  const icon = new roadSignIcon({ iconUrl: iconURL });
  layer.setIcon(icon).addTo(map);

  layer.on('click', async (e) => {
    await showPopup(feature, layer);
  });
};

// Create additional Control placeholders
const addControlPlaceholders = async (map) => {
  const corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

  createCorner('verticalcenter', 'left');
  createCorner('verticalcenter', 'right');

  function createCorner(vSide, hSide) {
    const className = l + vSide + ' ' + l + hSide;
    corners[vSide + hSide] = L.DomUtil.create('div', className, container);
  };
};

const locateUser = async () => {
  map.locate({
    setView: true, 
    watch: true
  }).on('locationfound', (e) => {
    map.removeLayer(marker);
    const icon = new roadSignIcon({iconUrl: '/assets/images/icons/road-signs/crosshair-marker.svg'});
    marker = L.marker(e.latlng).setIcon(icon).addTo(map);
    circle = L.circle(e.latlng, e.accuracy/2, {
      weight: 1,
      color: 'blue',
      fillColor: '#cacaca',
      fillOpacity: 0.2
    }).addTo(map);
    map.setView([e.latitude, e.longitude], 16)
  });
};

const addEvents = async () => {
  // map.on('zoomend', function() {
  //     let currentZoom = map.getZoom();
  //     circle.setRadius(currentZoom);
  // });

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
};
  
export { initMap };