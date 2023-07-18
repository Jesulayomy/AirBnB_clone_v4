$(document).ready(function () {
  const amDict = {};

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status == 'OK') {
      $('DIV#api_status').addClass('available');
    }
  }).fail(function (data, stats, err) {
    $('DIV#api_status').removeClass('available');
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
