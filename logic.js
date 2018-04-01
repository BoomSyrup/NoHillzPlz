// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
var inputStart = document.getElementsByName("start")[0];
var inputEnd = document.getElementsByName("end")[0];
var route = document.getElementById("route");
document.addEventListener("DOMContentLoaded", function(){
    var car = document.getElementById("car");
    var bike = document.getElementById("bike");
    car.onclick = function(){
        if(!car.classList.contains("selected"))
        {
            car.classList.toggle("selected");
            bike.classList.toggle("selected");
        }
    }
    bike.onclick = function(){
        if(!bike.classList.contains("selected"))
        {
            car.classList.toggle("selected");
            bike.classList.toggle("selected");
        }
    }
});
function initMap() {
    var autocompleteStart = new google.maps.places.Autocomplete(inputStart); 
    var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd); 
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    infoWindow = new google.maps.InfoWindow;
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.052235, lng: -118.243683},
    zoom: 5
    });
    directionsDisplay.setMap(map);
    var onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        console.log('click')
    };
    route.onclick = onChangeHandler;
    function calculateAndDisplayRoute(directionsService, directionsDisplay)
    {
        var car = document.getElementById("car");
        var bike = document.getElementById("bike");
        var travelMode;
        if(car.classList.contains("selected"))
            travelMode = 'DRIVING'
        if(bike.classList.contains("selected"))
            travelMode = 'BICYCLING'
        directionsService.route({
            origin: inputStart.value,
            destination: inputEnd.value,
            travelMode: travelMode
            }, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
                console.log(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
    }
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
    console.log("error")
}

