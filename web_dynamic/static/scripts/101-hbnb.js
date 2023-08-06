function getIndex (id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) return i;
  }
  return -1;
}

function createPlaces (places) {
  $('section.places').empty();
  for (const place of places) {
    const newArticle = $('<article>');

    const titleDiv = $('<div>').addClass('title_box');
    titleDiv.append(`<h2>${place.name}</h2`);
    titleDiv.append($('<div>').addClass('price_by_night').text(`$${place.price_by_night}`));
    newArticle.append(titleDiv);

    const infoDiv = $('<div>').addClass('information');

    let text;
    text = place.max_guest === 1 ? 'Guest' : 'Guests';
    infoDiv.append($('<div>').addClass('max_guest').text(`${place.max_guest} ${text}`));

    text = place.number_rooms === 1 ? 'Bedroom' : 'Bedrooms';
    infoDiv.append($('<div>').addClass('number_rooms').text(`${place.number_rooms} ${text}`));

    text = place.number_bathrooms === 1 ? 'Bathroom' : 'Bathrooms';
    infoDiv.append($('<div>').addClass('number_bathrooms').text(`${place.number_bathrooms} ${text}`));

    newArticle.append(infoDiv);
    newArticle.append($('<div>').addClass('description').html(place.description));

    const reviewDiv = $('<div>').addClass('reviews').attr('id', place.id);
    const toggle = $('<span>').addClass('toggle').text('Show');
    toggle.click(function () {
      if (toggle.text() === 'Show') {
        getReviews(place.id, reviewDiv);
        toggle.text('Hide');
      } else {
        $(`section.places div#${place.id} ul`).remove();
        toggle.text('Show');
      }
    });

    reviewDiv.append($('<h2>').text('Reviews').append(toggle));
    newArticle.append(reviewDiv);

    $('section.places').append(newArticle);
  }
}

function getPlaces (data) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (response) {
      createPlaces(response);
    }
  });
}

function createReviews (reviews, reviewDiv) {
  const ul = $('<ul>');
  for (const review of reviews) {
    $.get(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`, function (response) {
      const head = $('<h3>').text(`From ${response.first_name} ${response.last_name}`);
      const li = $('<li>').append(head).append($('<p>').html(review.text));
      ul.append(li);
    });
  }
  reviewDiv.append(ul);
}

function getReviews (placeId, reviewDiv) {
  $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, function (response) {
    createReviews(response, reviewDiv);
  });
}

$(function () {
  const allChecked = {
    state: [],
    city: [],
    amenity: []
  };
  $('input[type="checkbox"]').each(function (i, checkbox) {
    $(checkbox).on('change', function () {
      const checkedId = $(checkbox).attr('data-id');
      const checkedName = $(checkbox).attr('data-name');
      const checkedType = $(checkbox).attr('data-type');
      if ($(checkbox).prop('checked')) {
        allChecked[checkedType].push({ id: checkedId, name: checkedName });
      } else {
        const index = getIndex(checkedId, allChecked[checkedType]);
        if (index !== -1) allChecked[checkedType].splice(index, 1);
      }

      const stateNames = [];
      const stateIds = [];
      for (const state of allChecked.state) {
        stateNames.push(state.name);
        stateIds.push(state.id);
      }

      const cityNames = [];
      const cityIds = [];
      for (const city of allChecked.city) {
        cityNames.push(city.name);
        cityIds.push(city.id);
      }
      $('.locations h4').text(`${stateNames.join(', ')}, ${cityNames.join(', ')}`);

      const amenityNames = [];
      const amenityIds = [];
      for (const amenity of allChecked.amenity) {
        amenityNames.push(amenity.name);
        amenityIds.push(amenity.id);
      }
      $('.amenities h4').text(amenityNames.join(', '));

      getPlaces({ states: stateIds, cities: cityIds, amenities: amenityIds });
    });
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  getPlaces({});
});
