window.routes = window.routes || {} // hold all data of routes
global_counter = 0; //counter for routes done
     delay = 1000; // delay amount for over_query_limit

/*******
route_stdDev
input: directionsResult object response, int indexroute
output: none
effect: given a route from response, parse the elevation data of given segments of a road
Then calculate the std, mean and median of slope differences. When all routes are filled, pick out
route of best fit.
Todo (possibilities): scale amount of samplings by the distance traveled per segments
                      write out evaluation of best route.
****/
function route_stdDev(response, indexroute) {
  var elevator = new google.maps.ElevationService;
   route_array = response.routes;
   latlng_array  = route_array[indexroute].overview_path;
   for(i = 1; i < latlng_array.length; i++){ //segment out path
     var path = [
       {lat: latlng_array[i-1].lat(), lng: latlng_array[i-1].lng()},
       {lat: latlng_array[i].lat(), lng: latlng_array[i].lng()}
     ];

     elevator.getElevationAlongPath({ //sample 5 elevation points of segment
       'path': path,
       'samples': 5
     },plotElevation.bind(null, latlng_array.length, indexroute, response.routes.length));
   }}
   /*******
  plotElevation
   input: segments_length, route_index , routeslength, elevations, status
   output: none
   effect: used in response to call for elevation sampling; what do with data
   ****/
function plotElevation( segments_length, route_index , routeslength, elevations, status) {
  if (status === 'OVER_QUERY_LIMIT') {
    console.log('oql');
    setTimeout(
      plotElevation.bind(null, segments_length, route_index , routeslength, elevations, status),
      delay += 1000
    )
    return;
  }
  else if (status !== 'OK'){
    console.log("THIS IS THE RESPONSE:", status)
    return;
  }
       elevatorArr = [];
  for(var i = 0; i < elevations.length; ++i)
  {
      elevatorArr[i] = elevations[i].elevation; //put in array to calculate std
  }
  window.routes[route_index].segments.push(standardDeviation(elevatorArr)); //store std
  if(window.routes[route_index].segments.length == segments_length-1){
    //find values based on std of all
    window.routes[route_index].median = med(window.routes[route_index].segments);
    window.routes[route_index].std = standardDeviation(window.routes[route_index].segments);
    window.routes[route_index].mean = average(window.routes[route_index].segments);
    global_counter += 1;
  }
  if( global_counter ==routeslength){//judging
    for(i = 0; i < 3; i ++){
    console.log('Route ' + i+ ': ' + window.routes[i].std);}
  }
}
/*******
standardDeviation
input: array values
output: standard deviation value
****/
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
/*******
average
input: array data
output: average value
****/
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}
/*******
med
input: array values
output: median value
****/
function med(values){
  values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
