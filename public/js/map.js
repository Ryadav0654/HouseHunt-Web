 
    function initMap() {
    map = new mappls.Map("map", 
    { 
      center: {lat: coordinate[1], lng: coordinate[0]},
      zoomControl: true,
        location: true
     
    }
);
    var marker = new mappls.Marker({
      map: map,
      position: {lat: coordinate[1], lng: coordinate[0]},

    });


  }