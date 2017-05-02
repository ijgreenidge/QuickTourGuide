/*global google $*/

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyAj-nd5Dm7AVo2M1zOSL2Qp00oGJDOefs0',
        // Your API key will be automatically added to the Discovery Document URLs.
        'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
        // clientId and scope are optional if auth is not required.
        'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
        'scope': 'profile',
    }).then(function() {
        // 3. Initialize and make the API request.
        return gapi.client.people.people.get({
            resourceName: 'people/me'
        });
    }).then(function(response) {
        console.log(response.result);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
};

gapi.load('client', start);

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
            updatePhotos(place);
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


    function updatePhotos(place) {
        $("#photos").html("");
        for (var i = 0; i < place.photos.length; i++) {
            var url = place.photos[i].getUrl({
                "maxWidth": 500,
                "maxHeight": 500
            });
            $("#photos").append("<img class='image-fluid' src=" + url + " />");
        }
    }
}





// Flickr API KEY --> d0276e79c493dbc248d527abad92ae33
// Google Map API KEY --> AIzaSyDLeay - 3 D4F8f2RnSTncDkF5tOxm0naI_4

// "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d0276e79c493dbc248d527abad92ae33&text=miami&format=json"

// Spotify API KEY --> b84ecb78168145d2a4d1e4bd0808d2eb
// Spotify Secret --> 3301badf291d47e3840874019ee39892
// GET	/v1/search?type=playlist
