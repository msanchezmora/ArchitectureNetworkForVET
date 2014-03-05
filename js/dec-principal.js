//     dec-principal.js 1.0  under MIT license
//     
//     2013  (c) colaborativa.eu and contributors
//     http://colaborativa.eu/proyectos/disponible-en-cordoba/

// Definición variables globales
// ------------------------------
var DEBUG_MAP = 0;
var map;
// Definición de los identificadores para el mapa y la fuente de los datos en **Google Drive**.
// Sustituir por vuestros identificadores específicos.
var data_id = '0ApaZkqgevJCgdFdRc0dwbHlXWHkzVW9PYnZ0cFY4elE';
var map_id  = 'colaborativa.gop5774e';

// Creación e inicialización del objeto mapa
var map = L.mapbox.map('map', map_id, {gridControl: false});
map.setView({ lat: 47.547, lon: 18.545 }, 5);
    
$( document ).ready(function() {
// Función Principal
// ------------------------------
// Obtención de los datos de la spreadsheet en **Google Drive**. 
// La función `mg_google_docs_spreadsheet_1` está definida en `dec-google_docs.js`.
// Al terminar y ya que se ha definido callback, se invocará la función mapData definida más abajo.
mmg_google_docs_spreadsheet_1(data_id, mapData);
// Funciones Auxiliares
// --------------------
// La función `mapData` se encarga de definir todas las capas del mapa, crear los markers (pinchos),
// definir los eventos asociados a acciones sobre el mapa (mouse click, mouse over) y
// añadir información en la barra lateral izquiera sobre el marker (pincho o edificio) seleccionado.
function mapData(f) {
    if( DEBUG_MAP) {console.log("function mapData");}
    // La variable `f` contiene todos los markers del mapa, cada uno con sus propiedades asociadas: 
    // título, descripción, etc.
    features = f;
     // Ahora se añaden los markers al mapa en formato GeoJSON.  
    var markerLayer = L.mapbox.markerLayer(features)
    .addTo(map);
    
    // 'Name' 'Contact-Person''Type-of-Institution''Category''Country'
    // 'City''Web-page''Address''Email'Description'
    
    var mustacheTemplate = '<a class="closeWindow" href="#">&#10006;</a>' +
    '<script> $(".closeWindow").click(function(){ $("#contentDetail").removeClass("activo").addClass("inactivo"); return false; });</script>'+
    '<h1>{{name}}</h1>'+
    '<h2> {{type-of-institution}} · {{category}}</h2>'+
    '<h3>{{city}} {{country}} </h3>'+
    '<p id="descripcion">{{description}}</p>'+
     '<script> if ( "{{email}}" != "") {'+
    '$("#contentDetail #descripcion").append("'+"<p><a href='mailto:{{email}}'>Contact Email </a></p>"+'");'+
    '}</script>'+
    '<script> if ( "{{web-page}}" != "") {'+
    '$("#contentDetail #descripcion").append("'+"<p><a href='{{web-page}}'>Additional Information</a></p>"+'");'+
    '}</script>'+
    '<p class="footer">'+
    '<a href="http://colaborativa.eu"> Colaborativa.eu</a> 2013. Free Code with license '+
    '<a href="http://opensource.org/licenses/MIT">MIT</a> available in <a href="https://github.com/msanchezmora/ArchitectureNetworkForVET">GitHub</a>. Open Data with license <a href="http://opendatacommons.org/licenses/odbl/">ODC-ODbL</a>. Texts and images with license <a href="http://creativecommons.org/licenses/by/3.0/es/">CC BY 3.0 ES.</a>'+
    '</p>';
    markerLayer.eachLayer(function(layer){
    // here you call `bindPopup` with a string of HTML you create - the feature
    // properties declared above are available under `layer.feature.properties`
        var content = layer.feature.properties.name;
        layer.bindPopup(content);
    });
    markerLayer.on('click', function(e){
            e.layer.unbindPopup();
            $('#map .leaflet-popup').css('display','none');
            $('#contentDetail').removeClass('inactivo').addClass('activo'); 
            $('#contentDetail').html('');
            var html = Mustache.to_html(mustacheTemplate, e.layer.feature.properties);
            $('#contentDetail').html(html);
            e.layer.bindPopup();
    });
    // Llamada a la función `download_data` definida más abajo.
    download_data();
}

        
// La función `download_data` introducirá los enlaces a los datos abiertos en formato CSV y JSON en el HTML.
// Utiliza la variable `data_id definida al comienzo para obtener los datos de **Google Drive SpreadSheet**.
function download_data() {
     if( DEBUG_MAP) {console.log("function download_data");}
    // La llamada URL para formato `CSV` es:
    $('#download_csv').attr('href', 'https://docs.google.com/spreadsheet/pub?key=' + data_id + '&output=csv');
    // La llamada URL para formato `JSON` es:
    $('#download_json').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}
});
