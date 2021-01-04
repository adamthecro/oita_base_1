// Creem les variables que necessitarem de forma global
var latitud = 41.716379;
var longitude = 1.8220914;
var mymap;

// Importem l'icona que farem servir per senyalitzar l'avió
var ico_l = L.icon({
    iconUrl: 'assets/map-plane.png',
    iconSize: [30, 30],
});

// Creem i atribuim el mapa al el div amb el id "map_id"
mymap = L.map('map_id').setView([latitud, longitude], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'OmsAndMoscas',
    maxZoom: 50,
    id: 'mapbox.streets',
    style: "grayscale"
}).addTo(mymap);

// Creem una marker fent servir l'icona que hem importat anteriorment i l'apliquem almapa
var marker = L.marker([latitud, longitude], {
    icon: ico_l
}).addTo(mymap);