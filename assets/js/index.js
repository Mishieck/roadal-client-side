import { initMap } from "./map/map.js";


$(() => {
  initMap();
  addEvents();
});

const addEvents = () => {
  $('#show-sidebar').on('click', () => {
      $('#sidebar').addClass('show').removeClass('hide');
      $('.overlay').addClass('show').removeClass('hide');
  });

  // Sidebar
  $('.hide-sidebar').on('click', () => {
      $('#sidebar').addClass('hide-sidebar').removeClass('show-sidebar');
  });
    
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
      se
      lectFormHandler(this);
  });
  
  // $('#nav-dd-btn').on('click', showNotifications);
};