$(document).ready(function () {
  const amDict = {};

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
