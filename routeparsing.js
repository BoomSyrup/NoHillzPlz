window.routes = window.routes || {}
global_counter = 0;
function route_stdDev(response, indexroute) {
  var elevator = new google.maps.ElevationService;
   route_array = response.routes;

   latlng_array  = route_array[indexroute].overview_path;

   for(i = 1; i < latlng_array.length; i++){
     var path = [
       {lat: latlng_array[i-1].lat(), lng: latlng_array[i-1].lng()},
       {lat: latlng_array[i].lat(), lng: latlng_array[i].lng()}
     ];
     delay = 1000;
     elevator.getElevationAlongPath({
       'path': path,
       'samples': 16
     },plotElevation.bind(null, latlng_array.length, indexroute, response.routes.length, delay));
   }
}
function plotElevation( segments_length, route_index , routeslength, delay_time, elevations, status) {
  if (status == 'OVER_QUERY_LIMIT') {
    setTimeout(
      plotElevation.bind(null, segments_length, route_index , routeslength, delay_time + 100, elevations, status),
      delay_time+100
    )
    return;
  }
  else if (status !==  'OK'){
    console.log("THIS IS THE RESPONSE:", status)
    return;
  }
       elevatorArr = [];
  for(var i = 0; i < elevations.length; ++i)
  {
      elevatorArr[i] = elevations[i].elevation;
  }
  window.routes[route_index].segments.push(standardDeviation(elevatorArr));
  if(window.routes[route_index].segments.length == segments_length){
    window.routes[route_index].median = med(window.routes[route_index].segments);
    window.routes[route_index].std = standardDeviation(window.routes[route_index].segments);
    window.routes[route_index].mean = average(window.routes[route_index].segments);
    console.log('nihao');
    global_counter += 1;
  }
  if( global_counter ==routeslength){
    console.log('works');
  }

}
function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}
function med(values){
  values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
