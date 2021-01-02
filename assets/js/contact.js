const LUSAKA_COORDS = [-15.40669, 28.28713];
const MAX_ZOOM = 19;

const LAYER_URLS = {
  streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};


window.addEventListener("load", async e => {
let map,
    marker,
    circle,
    MarkerIcon;

  map = L.map('map').setView(LUSAKA_COORDS, 16);
  // $('.leaflet-control-attribution' ).css('display', 'none');

  const streets = L.tileLayer(LAYER_URLS.streets, { maxZoom: MAX_ZOOM });
  streets.addTo(map);
  
  marker = L.marker();
  circle = L.circle();

  // Map controls positioning 
  await addControlPlaceholders(map);

  // Change the position of the Zoom Control to a newly created placeholder.
  map.zoomControl.setPosition('verticalcenterright');

  MarkerIcon = await MarkerIconClass();
});

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

const MarkerIconClass = async () => {
  return L.Icon.extend({
    options: {
      iconSize:     [48, 48],
      iconAnchor:   [24, 48],
      popupAnchor:  [0, -48]
    }
  });
};