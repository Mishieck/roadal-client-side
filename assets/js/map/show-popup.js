export const showPopup = async (feature, layer) => {
  const html = `
    <section>
      <div class="ml-2 text-nowrap mt-3 sitename">Site Name</div>
      <div class="border-top my-1"></div>
      <div class="ml-2 text-nowrap mt-3 site-coords">Site Coordinates</div>
      <div class="border-top my-1"></div>
      <div class="mt-3">
        <img src="../../images/icons/road-signs/full-closure.svg" alt="">
        <span class="passability">Road Fully Closed</span>
      </div>
      <div class="border-top my-1"></div>
      <div class="mt-3 images">
        <div class="ml-2">Site Images</div>
        <div class="border-top my-1"></div>
        <div class="mt-2">
            <a href="#" class="open-viewer site-img-link"><img src="" alt="" class="rounded site-image"></a>
        </div>
        <div class="d-flex justify-content-center mt-1 mb-3 image-controls">
          <a href="#" class="mr-3 border-0 prev"><img src="/resources/images/icons/iconmonstr-arrow-79.svg" alt=""></a>
          <span class="image-count">1</span>
          <a href="#" class="ml-3 border-0 next"><img src="/resources/images/icons/iconmonstr-arrow-37.svg" alt=""></a>
        </div>
      </div>
      <div>
        <div class="ml-2 mt-3">Affected roads</div>
        <div class="border-top mt-1"></div>
        <ul class="list-group list-group-flush roads">
          <li class="list-group-item">No roads included yet</li>
        </ul>
      </div>
      <div class="border-top my-1"></div>
      <div>
        <div class="ml-2 mt-3">Activities</div>
        <div class="border-top mt-1"></div>
        <ul class="list-group list-group-flush activities">
          <li class="list-group-item">No activities included yet.</li>
        </ul>
      </div>
    </section>`

  layer.bindPopup(html);
  layer.openPopup();

  $('.sitename').text(feature.properties.name);
  $('.site-coords').text(feature.geometry.coordinates[1] + '\t' + feature.geometry.coordinates[0]);
  $('.site-image').attr('src', feature.properties.images[0]);

  const roads = feature.properties.affectedRoads,
        $roads = $('.roads');

  let $road = null;

  if(roads[0]) {
    let $list = [];

    roads.forEach(road => {
      $road = $('<li>', {"class": 'list-group-item'});
      $road.text(road);
      $list.push($road);
    });
    
    $roads.append($list);
  }
}