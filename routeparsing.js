function route_stdDev(response, i) {
   route_array = response.getRoutes();
   latlng_array  = route_array[i].getOverview_Path();
    x= [];
    var elevator = new google.maps.ElevationService;
   for(i = 1; i < latlng_array.length; i++){
     var path = {
       latlng_array[i-1],
       latlng_array[i]
     };
     elevatorArr = [];
     elevator.getElevationAlongPath({
       'path': path,
       'samples': 16
     },plotElevation);
     
   }
   function plotElevation(elevations, status) {
     if (status !== 'OK') {
       console.log('WTF')
       return;
     }
     for(var i = 0; i < elevations.length; ++i)
     {
         elevationArr[i] = elevations[i].elevation;
     }
   }
}
