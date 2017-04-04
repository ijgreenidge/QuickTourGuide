var searchBox;

function initAutocomplete() {
 var map = new google.maps.Map(document.getElementById('map'), {
  center: {
   lat: -33.8688,
   lng: 151.2195
  },
  zoom: 13,
  mapTypeId: 'roadmap'
 });

 // Create the search box and link it to the UI element.
 var input = document.getElementById('city-input');
 searchBox = new google.maps.places.SearchBox(input);
 console.log(searchBox);

 // Bias the SearchBox results towards current map's viewport.
 map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
 });

 var markers = [];
 // Listen for the event fired when the user selects a prediction and retrieve
 // more details for that place.
 searchBox.addListener('places_changed', function() {
  var places = searchBox.getPlaces();

  if (places.length == 0) {
   return;
  }

  // Clear out the old markers.
  markers.forEach(function(marker) {
   marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
   if (!place.geometry) {
    console.log("Returned place contains no geometry");
    return;
   }
   var icon = {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
   };

   // Create a marker for each place.
   markers.push(new google.maps.Marker({
    map: map,
    icon: icon,
    title: place.name,
    position: place.geometry.location
   }));

   if (place.geometry.viewport) {
    // Only geocodes have viewport.
    bounds.union(place.geometry.viewport);
   }
   else {
    bounds.extend(place.geometry.location);
   }
  });
  map.fitBounds(bounds);
 });
 $("#go").click(function() {
  //searchBox.trigger('places_changed');

  var searchTerm = $("#city-input").val();
  console.log(searchTerm);
   $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d0276e79c493dbc248d527abad92ae33&text=" + searchTerm + "&format=json",
   
   
     function(response) { 
      for (var i = 0; i < photos.photo.length; i++) {
       var id = photos.photo[i].id
       var serverId = photos.photo[i].server;
       var farmId = photos.photo[i].farm;
       var secret = photos.photo[i].secret;
       "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg"

       $("#photos").append("<img src="+ "https://farm"+farmId+".staticflickr.com/"+serverId+"/"+id+"_"+secret+".jpg" +"/>")
      }
    });

 });
 $("#city-input").keypress(function(e) {
  if (e.keyCode == 13)
   $("#go").click();
 });
}





// Flickr API KEY --> d0276e79c493dbc248d527abad92ae33
// Google Map API KEY --> AIzaSyDLeay - 3 D4F8f2RnSTncDkF5tOxm0naI_4

// "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d0276e79c493dbc248d527abad92ae33&text=miami&format=json"
