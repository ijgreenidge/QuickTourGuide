/*global google $*/

function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYoutubeApiLoad);
    console.log("youtube loaded");
}

function onYoutubeApiLoad() {
    gapi.client.setApiKey("AIzaSyCzVOUqO_DSfgQpbCI_EE12KkOKoqTQC_4");
    console.log("api key set");
}

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
        console.log("Searching...")
        var places = searchBox.getPlaces();

        //console.log(places);

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
        searchVideos(places[0].name);
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

    function searchVideos(searchWord) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            q: searchWord
        });
        request.execute(onSearchResponse);
    }

    function onSearchResponse(response) {
        $("#youtube").html("");
        console.log(response);
        for (var i = 0; i < response.items.length; i++) {
            console.log("appending...");

            //$("#youtube").append("<div class='video-container'><div class='embed-responsive embed-responsive-16by9 video-embed'><iframe class='embed-responsive-item' width='420' height='315' src='https://www.youtube.com/embed/"+ response.items[i].id.videoId + "'></iframe></div></div>");
            $("#youtube").append("<div class='video-container embed-responsive embed-responsive-16by9'><div class='video-wrapper'><div class='youtube' id='" + response.items[i].id.videoId + "' data-params='modestbranding=1&showinfo=0&controls=0&vq=hd720'></div></div></div>");
        }
        var tag = document.createElement('script');
        tag.src = "video.js";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}






// Google Map API KEY --> AIzaSyDLeay - 3 D4F8f2RnSTncDkF5tOxm0naI_4
