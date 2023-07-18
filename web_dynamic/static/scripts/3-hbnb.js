$(document).ready(function () {
  const amDict = {};

  //gets the status of the api and shows it in the browser
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    console.log('GetJson of Status');
    if (data.status == 'OK') {
      $('DIV#api_status').addClass('available');
    }
  }).fail(function (data, stats, err) {
    $('DIV#api_status').removeClass('available');
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({})
  }).done((res) => {
    console.log('AJAX');
    console.log(res);
    const places = $('section.places');

    for (let place of res) {
      let article = $('<article></article>');

      article.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
      article.append('<h2>' + place.name + '</h2>');
      let subdiv = $('<div class="informations"></div>')
      subdiv.append('<div class="max_guest">' + place.max_guest + ' Guests</div>');
      subdiv.append('<div class="number_rooms">' + place.number_rooms + ' Rooms</div>');
      subdiv.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathrooms</div>');
      article.append(subdiv);
      article.append('<div class="description">' + place.description + '</div>');

      places.append(article);
    }
  });


  // Once a checkbox in any li changes...
  $('li :checkbox').change(function () {
    let amID = $(this).attr('data-id');
    let amName = $(this).attr('data-name');

    if (this.checked) {
      amDict[amID] = amName;
    } else {
      delete amDict[amID];
    }

    $('div.amenities h4').empty();

    let fltrAm = $.map(amDict, function (val) {
      return val;
    }).join(', ');

    $('div.amenities h4').text(fltrAm);
  });
});
