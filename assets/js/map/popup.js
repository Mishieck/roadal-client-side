export const popup = async feature => {
  const properties = feature.properties;

  const id = feature.id,
        name = properties.name,
        passability = properties.passability,
        images = properties.images,
        affectedRoads = properties.affectedRoads,
        activities = properties.activities,
        coordinates = feature.geometry.coordinates;
 
  const markerURLs = {
    "Closed": "/assets/img/icons/road-signs/red-marker.svg",
    "Partially Closed": "/assets/img/icons/road-signs/yellow-marker.svg",
    "Open": "/assets/img/icons/road-signs/green-marker.svg"
  };

  const messages = {
    "Closed": "Road is fully closed.",
    "Partially Closed": "Road is partially closed.",
    "Open": "Road is fully open."
  };

  const createImage = image => {
    const altText = `${name} - ${image.substring(image.lastIndexOf("/") + 1, image.lastIndexOf("@"))}`;

    return `
      <a href="#" class="carousel-item active site-image-link" data-image-src="${image.replace("@360p", "@720p")}">
        <img class="d-block w-100" src="${image}" alt="${altText}">
      </a>
    `;
  };

  const markerURL = markerURLs[passability];
  const message = messages[passability];
  const $affectedRoads = affectedRoads.map(road => `<li class="list-group-item">${road}</li>`).join("");
  const $activities = activities.map(activity => `<li class="list-group-item">${activity}</li>`).join("");
  let $carousel = '<div class="ml-2">No images added.</div>';

  if(images[0]) {
    const $images = images.map(createImage).join("");

    $carousel = `
      <div id="${id}" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          ${$images}
        </div>
        <a class="carousel-control-prev" href="#${id}" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#${id}" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    `;
  };

  const html = `
    <section class="popup m-0 p-0">
      <header class="header h5 text-center">
        Site Information
      </header>

      <div class="border-top my-1"></div>

      <main>
        <div class="ml-2 text-nowrap mt-3 sitename">${name}</div>
        <div class="border-top my-1"></div>
        <div class="ml-2 text-nowrap mt-3 site-coords">${coordinates[1]} ${coordinates[0]}</div>
        <div class="border-top my-1"></div>
        <div class="mt-3 passability">
          <img class="ml-2 mr-2" src="${markerURL}" alt="" style="max-width: 32px;">
          <span class="passability">${message}</span>
        </div>
        <div class="border-top my-1"></div>
        <div class="mt-3 mb-2 images">
          <div class="ml-2 site-images-header">Site Images</div>
          <div class="border-top my-1"></div>
          ${$carousel}
        </div>
        <div class="border-top my-1"></div>
        <div class="affected-roads-container">
          <div class="ml-2 mt-3 affected-roads-header">Affected roads</div>
          <div class="border-top mt-1"></div>
          <ul class="list-group list-group-flush roads-list">
            ${$affectedRoads}
          </ul>
        </div>
        <div class="border-top my-0"></div>
        <div class="mt-3 activities-conatainer">
          <div class="ml-2 activities-header">Activities</div>
          <div class="border-top mt-1"></div>
          <ul class="list-group list-group-flush activities-list">
            ${$activities}
          </ul>
        </div>
      </main>
    </section>
  `;

  return html;
}