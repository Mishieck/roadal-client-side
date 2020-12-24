import { initMap } from "./map/map.js";


$(() => {
    /* Map ******************************************************************************************/
    initMap();
    $('#show-sidebar').on('click', () => {
        $('#sidebar').addClass('show').removeClass('hide');
        $('.overlay').addClass('show').removeClass('hide');
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

/* Sidebar ******************************************************************************************/

$('.hide-sidebar').on('click', () => {
  $('#sidebar').addClass('hide').removeClass('show');
  $('.overlay').addClass('hide').removeClass('show');
});


$('.overlay').on('click', () => {
  $('#sidebar').addClass('hide').removeClass('show');
  $('.overlay').addClass('hide').removeClass('show');
});

$('form').on('submit', function(e) {
    e.preventDefault();
    selectFormHandler(this);
});

// $('#nav-dd-btn').on('click', showNotifications);