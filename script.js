 var searchterm;


 var map;
 var infowindow;

 function initMap() {
     var pyrmont = {
         lat: -33.867,
         lng: 151.195
     };

     map = new google.maps.Map(document.getElementById('map'), {
         center: pyrmont,
         zoom: 15
     });

     infowindow = new google.maps.InfoWindow();
     var service = new google.maps.places.PlacesService(map);
     service.nearbySearch({
         location: pyrmont,
         radius: 500,
         type: ['sublocality']
     }, callback);
 }

 function callback(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
         for (var i = 0; i < results.length; i++) {
             createMarker(results[i]);
         }
     }
 }

 function createMarker(place) {
     var placeLoc = place.geometry.location;
     var marker = new google.maps.Marker({
         map: map,
         position: place.geometry.location
     });

     google.maps.event.addListener(marker, 'click', function() {
         infowindow.setContent(place.name);
         infowindow.open(map, this);
     });
 }


     // Flickr API KEY --> d0276e79c493dbc248d527abad92ae33
     // Google Map API KEY --> AIzaSyDLeay - 3 D4F8f2RnSTncDkF5tOxm0naI_4

     // "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d0276e79c493dbc248d527abad92ae33"
     