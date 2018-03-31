// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
var inputStart = document.getElementsByName("start")[0];
var inputEnd = document.getElementsByName("end")[0];
function initMap() {
    var autocompleteStart = new google.maps.places.Autocomplete(inputStart); 
    var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd); 
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.052235, lng: -118.243683},
    zoom: 5
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': pos}, function(results, status) {
    if (status === 'OK') {
        if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
        position: pos,
        map: map
      });
      infoWindow.setContent(results[0].formatted_address);
      infoWindow.open(map, marker);
      inputStart.value = results[0].formatted_address;
    } else {
      window.alert('No results found');
    }
  } else {
    window.alert('Geocoder failed due to: ' + status);
  }
});
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}
autocompleteStart.bindTo('bounds', map);
autocompleteStart.addListener('place_changed', function() {
      var place = autocompleteStart.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    }
})
autocompleteEnd.addListener('place_changed', function() {
      var place = autocompleteEnd.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
})
}; 

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn\'t support geolocation.');
infoWindow.open(map);
}
var route = document.getElementById("route");
function calculateRoute()
{
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService.route({
        origin: inputStart.value,
        destination: inputEnd.value,
        travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}
route.onclick = calculateRoute;
