mapboxgl.accessToken = 'pk.eyJ1Ijoib2xpeWFkIiwiYSI6ImNrdjdsbnYybjhhbzcydnQ5dGRjdWM3ODIifQ.x-icjc5_gVuDi8MWOqzw3g';
const map = new mapboxgl.Map({

      container: 'map',
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
      center: [-122.4443, 47.2529],
      zoom: 9, // starting zoom
      });

      map.on('load', function() {
      map.addLayer({
        id: 'hospitals',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: hospitalPoints
        },
        layout: {
          'icon-image': 'hospital-15',
          'icon-allow-overlap': true
        },
        paint: { }
      });
      map.addLayer({
        id: 'libraries',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: libraryPoints
        },
        layout: {
          'icon-image': 'library-15',
          'icon-allow-overlap': true
        },
        paint: { }
      });

      map.addSource('nearest-hospital', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
    ]
  }
});

    });
    var popup = new mapboxgl.Popup();

map.on('click', 'hospitals', function(e) {

  var feature = e.features[0];

  popup.setLngLat(feature.geometry.coordinates)
    .setHTML(feature.properties.NAME + ' locate at ' + feature.properties.ADDRESS + ' ZIP ' + feature.properties.ZIP)
    .addTo(map);


});





map.on('click', 'libraries', function(f) {

  // Using Turf, find the nearest hospital to library clicked
var refLibrary = f.features[0];
var nearestHospital = turf.nearest(refLibrary, hospitalPoints);

// Update the 'nearest-hospital' data source to include the nearest library
	map.getSource('nearest-hospital').setData({
      type: 'FeatureCollection',
      features: [
        nearestHospital
      ]
    });

    var imperial = {unit:'mile'}
    var distance = turf.distance(refLibrary, nearestHospital, imperial)

    // Create a new circle layer from the 'nearest-hospital' data source
    map.addLayer({
      id: 'nearestHospitalLayer',
      type: 'circle',
      source: 'nearest-hospital',
      paint: {
        'circle-radius': 12,
        'circle-color': '#486DE0'
      }
    }, 'hospitals');

    popup.setLngLat(refLibrary.geometry.coordinates)
  .setHTML('<b>' + refLibrary.properties.NAME + '</b><br>The nearest hospital is ' + nearestHospital.properties.NAME + ', located at ' + nearestHospital.properties.ADDRESS + ' zip ' + nearestHospital.properties.ZIP  +' it is '+ distance.toFixed(2)  + ' mile away.')
  .addTo(map);




});
