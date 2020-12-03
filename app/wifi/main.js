const electron = require("electron");
const {remote, ipcRenderer}=electron;

var socket = io.connect('http://localhost:9999');

//variables global
var p_connected=false


//Socket things
socket.on("devices", function(data){
    console.log(data)
    if(!data["plane"]){
        console.log("No plane")
        p_connected = false
        document.getElementById("p_av").style.display="flex";
        clearInterval(vid_inter);
        video=0;
        document.getElementById("video_play").innerHTML='<i class="glyphicon glyphicon-play"></i>';
    } else {
        p_connected=data["plane"];
        console.log(p_connected);
        document.getElementById("p_av").style.display="none";
    }
});

socket.on("image", function(data){
    document.getElementById("video_id").src='data:image/jpg;base64,' +data.substring(2, data.length - 1);
})

socket.on("data", function(data){

});


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



//NewRoute
var l_p = []
var d_l = []
var m_r = true;
function new_route(){
    if(m_r){
        document.getElementById("route_des").style.marginLeft="calc(75% - 50px)";
        m_r=false;
    } else {
        document.getElementById("route_des").style.marginLeft="100%";
        m_r=true;
    }
}
function onMapClick(e) {
    if(!m_r){
        var marker = L.marker([e.latlng.lat, e.latlng.lng], {icon: ico_l}).addTo(mymap);
        l_p.push([e.latlng.lat,e.latlng.lng,marker]);
        refresh_marks();
    }
}
function refresh_marks(){
    document.getElementById("locations").innerHTML="";
    for(var i = 0; i!=l_p.length; i++){
        document.getElementById("locations").innerHTML+='<div class="location alcentre"><div class="loc_r_n alcentre">'+i+'</div><div class="coord"><div class="coords"><b>Lat: </b>'+l_p[i][0]+'</div><div class="coords"><b>Long: </b>'+l_p[i][1]+'</div></div><div class="e_p alcentre" onclick="remove_mark('+i+')"><i class="glyphicon glyphicon-remove"></i></div></div>';
    }
    draw_lines()
    if(l_p.length>1){
        document.getElementById("submit_route").style.cursor="pointer";
    } else {
        document.getElementById("submit_route").style.cursor="not-allowed";
    }
}
function draw_lines(){
    for(var i = 0; i!=d_l.length; i++){
        mymap.removeLayer(d_l[i]);
    }
    d_l=[];
    var d_t=0
    for(var i = 0; i!=l_p.length-1; i++){
        var polygon = L.polygon([
            [l_p[i][0], l_p[i][1]],
            [l_p[i+1][0], l_p[i+1][1]],
        ]).addTo(mymap);
        d_l.push(polygon);
        x=(l_p[i][0]-l_p[i+1][0])*111133.33;
        y=(l_p[i][1]-l_p[i+1][1])*111319.88;
        d= Math.sqrt(x**2+y**2)
        d_t+=d;
    }
    document.getElementById("d_p_t").innerHTML=Math.round(d_t)+"m";
}
function remove_mark(id){
    mymap.removeLayer(l_p[id][2]);
    l_p.splice(id,1);
    refresh_marks();
}
async function submit_route(){
    if(l_p.length>1){
        m_r = true;
        document.getElementById("map_id").style.width="20%";
        document.getElementById("route_des").style.width="80%";
        document.getElementById("route_des").style.marginLeft="calc(20% - 50px)";
        document.getElementById("design_r").style.display="none"
        document.getElementById("finit_r").style.display="block"
        setTimeout(function(){mymap.setView([l_p[0][0],l_p[0][1]+0.13], 13);}, 100);
    }
}



//Video
var video = 0;
var flash = 0;
var vid_inter;
function want_video(){
    socket.emit("want", "image")
}
function pp_video(){
    if(video==0){
        vid_inter = setInterval(function(){want_video()}, 1500);
        video=1;
        document.getElementById("video_play").innerHTML='<i class="glyphicon glyphicon-pause"></i>';
    } else {
        clearInterval(vid_inter);
        video=0;
        document.getElementById("video_play").innerHTML='<i class="glyphicon glyphicon-play"></i>';
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
    clearInterval(vid_inter);
    video=0;
    document.getElementById("video_play").innerHTML='<i class="glyphicon glyphicon-play"></i>';
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
    iconUrl: '../assets/map-marker.png',
    iconSize: [30, 30],
});
var mymap = L.map('map_id').setView([latitud, longitude], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'OmsAndMoscas',
    maxZoom: 18,
    id: 'mapbox.streets',
    style: "grayscale"
}).addTo(mymap);
mymap.on('click', onMapClick);