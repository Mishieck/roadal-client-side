import { popup } from "./popup.js";

const LUSAKA_COORDS = [-15.38979694, 28.31819683];
const MAX_ZOOM = 19;

const LAYER_URLS = {
  streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

let map, streets, marker, circle, MarkerIcon;

const initMap = async () => {
  map = L.map("map").setView(LUSAKA_COORDS, 14);
  $(".leaflet-control-attribution").css("display", "none");

  streets = L.tileLayer(LAYER_URLS.streets, { maxZoom: MAX_ZOOM });
  streets.addTo(map);

  marker = L.marker();
  circle = L.circle();

  // Map controls positioning
  await addControlPlaceholders(map);

  // Change the position of the Zoom Control to a newly created placeholder.
  map.zoomControl.setPosition("verticalcenterright");

  MarkerIcon = await MarkerIconClass();
  await addOverlays();
  await addEvents();
};

const MarkerIconClass = async () => {
  return L.Icon.extend({
    options: {
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48]
    }
  });
};

const addOverlays = async () => {
  const overlays = await getOverlays();
  L.geoJSON(overlays.features, { onEachFeature });
};

const getOverlays = async () => (await fetch("/assets/json/main.json")).json();

const onEachFeature = async (feature, layer) => {
  const passability = feature.properties.passability;

  const markerURLs = {
    Closed: "/assets/img/icons/road-signs/red-marker.svg",
    "Partially Closed": "/assets/img/icons/road-signs/yellow-marker.svg",
    Open: "/assets/img/icons/road-signs/green-marker.svg"
  };

  const markerURL = markerURLs[passability];
  const icon = new MarkerIcon({ iconUrl: markerURL });
  layer.setIcon(icon).addTo(map);

  const html = await popup(feature);
  layer.bindPopup(html);
  layer.on("click", async (e) => {
    layer.openPopup();
    siteImageClick();
  });
};

// Create additional Control placeholders
const addControlPlaceholders = async (map) => {
  const corners = map._controlCorners,
    l = "leaflet-",
    container = map._controlContainer;

  createCorner("verticalcenter", "left");
  createCorner("verticalcenter", "right");

  function createCorner(vSide, hSide) {
    const className = l + vSide + " " + l + hSide;
    corners[vSide + hSide] = L.DomUtil.create("div", className, container);
  }
};

const locateUser = async () => {
  const locateMarkerIcon = new MarkerIcon({ iconUrl: "/assets/images/icons/road-signs/crosshair-marker.svg" });

  map.locate({ setView: true, watch: true }).on("locationfound", (e) => {
    map.removeLayer(marker);
    marker = L.marker(e.latlng).setIcon(locateMarkerIcon).addTo(map);

    circle = L.circle(e.latlng, e.accuracy / 2, {
      weight: 1,
      color: "blue",
      fillColor: "#cacaca",
      fillOpacity: 0.2
    }).addTo(map);

    map.setView([e.latitude, e.longitude], 16);
  });
};

const addEvents = async () => {
  // map.on('zoomend', function() {
  //     let currentZoom = map.getZoom();
  //     circle.setRadius(currentZoom);
  // });

  $(".basemap").on("change", (e) => switchBaseLayer(e.target.value));
  $("#locate").on("click", () => locateUser());
};

const siteImageClick = () => {
  const $siteImageLinks = $(".site-image-link");
  $siteImageLinks.click(function (e) {
    showImageViewer(this);
  });
};

const showImageViewer = (link) => {
  const links = link.parentElement.children;
  const name = link.closest(".popup").querySelector(".header").textContent;
  const $images = Array.from(links).map((lnk, i) => createImage(lnk.dataset.imageSrc, lnk.dataset.alt, i));
  const $imageViewer = $("#image-viewer");
  const $imageContainer = $("#site-carousel .carousel-inner");
  $imageContainer.append($images);
  $imageViewer.find(".modal-title").text(name);
  $imageViewer.modal("show");
};

const createImage = (src, alt, i) => {
  const $carouselItem = $("<div />", {
    class: `carousel-item ${i ? "" : "active"}`
  });

  const $img = $("<img />", {
    class: "d-block w-100",
    src,
    alt
  });

  $carouselItem.append($img);

  return $carouselItem;
};

export { initMap };
