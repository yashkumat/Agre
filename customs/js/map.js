
// Turn on all tooptips
$('.tooltipps').tooltip()
$( document ).ready(function() {
    $('#gcd-button-control').click()
});


// Defining custom control
proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

// Load json file of all layers
var AllLayersInfo
$.getJSON('layer.json', function(data){
    AllLayersInfo = data.layers
})

// Define a view
var view = new ol.View({
    projection:"EPSG:27700",
    center : [531815.6968983045, 178390.29102543357], //Coordinates of center
    zoom : 12//zoom level of map
})

//Define basemap
var OSMBaseMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJnZXJpdiIsImEiOiJjazludXBxcGowMmc1M2ZuNndweXh6bXl5In0.6NJz4WYp0542hCoBwWHx6g'
    })
  })
// River layer 
var riverWMS =  new ol.layer.Tile({
    source:new ol.source.TileWMS({
        url : 'https://environment.data.gov.uk/spatialdata/statutory-main-river-map/wms',
        params:{'LAYERS': 'Statutory_Main_River_Map', 'tiled':true}
    }),
    name : 'Main River'
})

// var DrainageVec =  new ol.layer.Vector({
//     source:new ol.source.Vector({
//         format : new ol.format.GeoJSON(),
//         url : './customs/js/drainage.geojson'
//     }),
//     name : 'drainage'
// })


// Define array of layers
var layerArray = [OSMBaseMap,riverWMS]

// Define our map
var map = new ol.Map({
    
    target:'map',
    layers:layerArray,
    view : view
})



var geocoder = new Geocoder('nominatim', {
    provider: 'osm',
    lang: 'en',
    placeholder: 'Enter the Postal code',
    limit: 5,
    debug: false,
    autoComplete: true,
    keepOpen: true
  });
  map.addControl(geocoder);
    
  //Listen when an address is chosen
  geocoder.on('addresschosen', function (evt) {
      console.info(evt);
    window.setTimeout(function () {
    //   popup.show(evt.coordinate, evt.address.formatted);
    }, 3000);
  });

// Layer Display on map
function layerdisplay(checkbox){
    var id = checkbox.id
    var checked = checkbox.checked

    if (checked){
        if (id == 'Areas_with_Critical_Drainage_Problems'){
            var layer =   new ol.layer.Vector({
                source:new ol.source.Vector({
                    format : new ol.format.GeoJSON(),
                    url : './customs/js/drainage.geojson'
                }),
                style :new ol.style.Style({
                    stroke: new ol.style.Stroke({
                      color: 'blue',
                      lineDash: [4],
                      width: 3
                    }),
                    fill: new ol.style.Fill({
                      color: 'rgba(0, 0, 255, 0.1)'
                    })
                  }),
                name : 'Areas_with_Critical_Drainage_Problems'
            })
            map.addLayer(layer)
                   
        } else {
        for(i=0;i<AllLayersInfo.length;i++){
            if(AllLayersInfo[i].layer){
                if (AllLayersInfo[i].layer == id){
                    var layer = new ol.layer.Tile({
                        source:new ol.source.TileWMS({
                            url : AllLayersInfo[i].Link,
                            params:{'LAYERS': id, 'tiled':true}
                        }),
                        name : id,
                        opacity:0.5
                    })
                    map.addLayer(layer)
                    break
                }
            }
        }
    }
    }else {
        for (i=0;i<map.getLayers().a.length;i++){
            if (map.getLayers().a[i].getProperties().name == id){
                map.removeLayer(map.getLayers().a[i])
                break
            }
        }
    }
}