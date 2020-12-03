const electron = require("electron");
const {remote, ipcRenderer}=electron;

var socket = io.connect('http://localhost:420');


//RC
var speed = 0;
var direction = 0;
refresh_s_d();
function refresh_s_d(){
    if(direction>0){
        document.getElementById("actual_direction").style.width = direction+"%";
        document.getElementById("actual_direction").style.marginLeft = direction+"%";
    }  else if(direction==0){
        document.getElementById("actual_direction").style.width = "1px";
        document.getElementById("actual_direction").style.marginLeft = "-0.5px"
    } else {
        document.getElementById("actual_direction").style.width = direction*-1+"%";
        document.getElementById("actual_direction").style.marginLeft = direction+"%";
    }
    document.getElementById("actual_speed").style.height=speed+"%";
}



//Video
var video = false;
var flash = 0;
var vid_inter;
function want_video(){
    socket.emit("want", "image")
}
function pp_video(){
    if(video){
        document.getElementById("video_play").style.color="rgb(150,150,150)";
        video=true;
    }
}
function f_video(){
    if(flash==0){
        flash=1;
        document.getElementById("video_flash").style.textDecoration="line-through";
    } else {
        flash=0;
        document.getElementById("video_flash").style.textDecoration="none";
    }

}
function deg_video(){
    degree = document.getElementById("range_degree").value;
}
function range_video(){
    document.getElementById("range_value").innerHTML=document.getElementById("range_degree").value+"º";
}



//Tabs things
function open_tab(id) {
    menu_close();
    for (var i = 1; i != 5; i++) {
        if (i == id) {
            document.getElementById("tab_" + id).style.display = "block";
            document.getElementById("tab_p_" + id).classList.add("active");
        } else {
            document.getElementById("tab_" + i).style.display = "none";
            document.getElementById("tab_p_" + i).classList.remove("active");
        }
    }
}



//Menu things
var menu = 0;
function menu_move() {
    if (menu == 0) {
        document.getElementById("menu_id").style.marginLeft = "0px";
        menu = 1;
    } else {
        document.getElementById("menu_id").style.marginLeft = "calc(-80% + 51px)";
        menu = 0;
    }
}

function menu_close() {
    document.getElementById("menu_id").style.marginLeft = "calc(-80% + 51px)";
    menu = 0;
}




//GeoMap
var latitud = 41.716379;
var longitude = 1.8220914;
$.get("http://ip-api.com/json", function(data, status){
    console.log(data);
    latitud=data["lat"];
    longitude=data["lon"];
});
//Map
var ico_l = L.icon({
    iconUrl: '../assets/map-plane.png',
    iconSize: [30, 30],
});
var mymap = L.map('map_id').setView([latitud, longitude], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'OmsAndMoscas',
    maxZoom: 18,
    id: 'mapbox.streets',
    style: "grayscale"
}).addTo(mymap);

marker = L.marker([latitud, longitude], {icon: ico_l}).addTo(mymap);
var marker;
//https://github.com/bbecquet/Leaflet.RotatedMarker INSTALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR
setInterval(() => {
    mymap.removeLayer(marker);
    latitud=latitud+0.0001;
    longitude=longitude+0.0001;
    marker = L.marker([latitud, longitude], {rotationAngle:180, icon: ico_l}).addTo(mymap);
}, 1000);



const serialport = require('serialport')
const tableify = require('tableify')

serialport.list((err, ports) => {
  console.log('ports', ports);
})