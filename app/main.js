var socket = io.connect('https://omsintheairserver.herokuapp.com');

//variables global
var p_connected = false


//Socket things
socket.on("devices", function (data) {
    console.log(data)
    if (!data["plane"]) {
        console.log("No plane")
        p_connected = false
        document.getElementById("p_av").style.display = "flex";
        clearInterval(vid_inter);
        video = 0;
        document.getElementById("video_play").innerHTML = '<i class="glyphicon glyphicon-play"></i>';
    } else {
        p_connected = data["plane"];
        console.log(p_connected);
        document.getElementById("p_av").style.display = "none";
    }
});

socket.on("image", function (data) {
    document.getElementById("video_id").src = 'data:image/jpg;base64,' + data.substring(2, data.length - 1);
})

socket.on("data", function (data) {

});

//NewRoute
var l_p = []
var d_l = []
var m_r = true;
function new_route() {
    if (m_r) {
        document.getElementById("route_des").style.marginLeft = "calc(80%)";
        m_r = false;
    } else {
        document.getElementById("route_des").style.marginLeft = "100%";
        m_r = true;
    }
}
function onMapClick(e) {
    if (!m_r) {
        var marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: ico_l }).addTo(mymap);
        l_p.push([e.latlng.lat, e.latlng.lng, marker]);
        refresh_marks();
    }
}
function refresh_marks() {
    document.getElementById("locations").innerHTML = "";
    for (var i = 0; i != l_p.length; i++) {
        document.getElementById("locations").innerHTML += '<div class="location alcentre"><div class="loc_r_n alcentre">' + i + '</div><div class="coord"><div class="coords"><b>Lat: </b>' + l_p[i][0] + '</div><div class="coords"><b>Long: </b>' + l_p[i][1] + '</div></div><div class="e_p alcentre" onclick="remove_mark(' + i + ')"><i class="glyphicon glyphicon-remove"></i></div></div>';
    }
    draw_lines()
    if (l_p.length > 1) {
        document.getElementById("submit_route").style.cursor = "pointer";
    } else {
        document.getElementById("submit_route").style.cursor = "not-allowed";
    }
}
function draw_lines() {
    for (var i = 0; i != d_l.length; i++) {
        mymap.removeLayer(d_l[i]);
    }
    d_l = [];
    var d_t = 0
    for (var i = 0; i != l_p.length - 1; i++) {
        var polygon = L.polygon([
            [l_p[i][0], l_p[i][1]],
            [l_p[i + 1][0], l_p[i + 1][1]],
        ]).addTo(mymap);
        d_l.push(polygon);
        x = (l_p[i][0] - l_p[i + 1][0]) * 111133.33;
        y = (l_p[i][1] - l_p[i + 1][1]) * 111319.88;
        d = Math.sqrt(x ** 2 + y ** 2)
        d_t += d;
    }
    document.getElementById("d_p_t").innerHTML = Math.round(d_t) + "m";
}
function remove_mark(id) {
    mymap.removeLayer(l_p[id][2]);
    l_p.splice(id, 1);
    refresh_marks();
}
function submit_route() {
    if (l_p.length > 1) {
        m_r = true;
        document.getElementById("map_id").style.width = "20%";
        document.getElementById("route_des").style.width = "80%";
        document.getElementById("route_des").style.marginLeft = "20%";
        document.getElementById("design_r").style.display = "none"
        document.getElementById("finit_r").style.display = "block"
        setTimeout(function () { mymap.setView([l_p[0][0], l_p[0][1] + 0.13], 13); }, 100);
    }
}
function cancel_route() {
    document.getElementById("map_id").style.width = "100%";
    document.getElementById("route_des").style.width = "20%";
    document.getElementById("route_des").style.marginLeft = "100%";
    document.getElementById("design_r").style.display = "none"
    document.getElementById("finit_r").style.display = "none"
    setTimeout(function () { mymap.setView([latitud, longitude], 13); }, 100);

}

//RC

var pitch_m1 = 0;
var pitch_m2 = 0;
var pitch_m3 = 0;
var pitch_gi = 0;
var roll_m1 = 0;
var roll_m2 = 0;
var roll_m3 = 0;
var roll_gi = 0;
var yaw_m1 = 0;
var yaw_m2 = 0;
var yaw_m3 = 0;
var yaw_gi = 0;
var stl_viewer = new StlViewer(
    document.getElementById("stl_cont"), {
    allow_drag_and_drop: false,
    models: [{
        id: 0,
        filename: "yeye.STL",
        opacity: 0.8,
        z: 1,
        color: "#000",
        view_edges: true
    }, {
        id: 1,
        filename: "yeye.STL",
        opacity: 0.5,
        z: 1,
        color: "#122D3B",
    }, {
        id: 2,
        filename: "yeye.STL",
        opacity: 0.5,
        z: 1,
        color: "#13361B",
    }, {
        id: 3,
        filename: "yeye.STL",
        opacity: 0.5,
        z: 1,
        color: "#421C1B",
    },]
}
);

//Video
var video = 0;
var flash = 0;
var vid_inter;
function want_video() {
    socket.emit("want", "image")
}
function pp_video() {
    if (video == 0) {
        vid_inter = setInterval(function () { want_video() }, 1500);
        video = 1;
        document.getElementById("video_play").innerHTML = '<i class="glyphicon glyphicon-pause"></i>';
    } else {
        clearInterval(vid_inter);
        video = 0;
        document.getElementById("video_play").innerHTML = '<i class="glyphicon glyphicon-play"></i>';
    }
}
function f_video() {
    if (flash == 0) {
        flash = 1;
        document.getElementById("video_flash").style.textDecoration = "line-through";
    } else {
        flash = 0;
        document.getElementById("video_flash").style.textDecoration = "none";
    }

}
function deg_video() {
    degree = document.getElementById("range_degree").value;
}
function range_video() {
    document.getElementById("range_value").innerHTML = document.getElementById("range_degree").value + "º";
}

//Tabs things
function open_tab(id) {
    menu_close();
    clearInterval(vid_inter);
    video = 0;
    document.getElementById("video_play").innerHTML = '<i class="glyphicon glyphicon-play"></i>';
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
var ico_l2 = L.icon({
    iconUrl: 'assets/map-plane.png',
    iconSize: [30, 30],
});

$.get("http://ip-api.com/json", function (data, status) {
    console.log(data);
    latitud = data["lat"];
    longitude = data["lon"];
});
var ico_l = L.icon({
    iconUrl: 'assets/map-marker.png',
    iconSize: [30, 30],
});
mymap2 = L.map('map_id2').setView([latitud, longitude], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'OmsAndMoscas',
    maxZoom: 50,
    id: 'mapbox.streets',
    style: "grayscale"
}).addTo(mymap2);
var mymap = L.map('map_id').setView([latitud, longitude], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'OmsAndMoscas',
    maxZoom: 18,
    id: 'mapbox.streets',
    style: "grayscale"
}).addTo(mymap);
mymap.on('click', onMapClick);


var marker = L.marker([latitud, longitude], {
    icon: ico_l2
}).addTo(mymap);
var marker = L.marker([latitud, longitude], {
    icon: ico_l2
}).addTo(mymap2);

setTimeout(function () {
    socket.on('planedata', function (msg) {
        stl_viewer.rotate(0, 0, msg["yaw_gi"] - yaw_gi, 0);
        stl_viewer.rotate(1, msg["pitch_m1"] - pitch_m1, 0, msg["roll_m1"] - roll_m1);
        stl_viewer.rotate(2, msg["pitch_m2"] - pitch_m2, 0, msg["roll_m2"] - roll_m2);
        stl_viewer.rotate(3, msg["pitch_m3"] - pitch_m3, 0, msg["roll_m3"] - roll_m3);

        pitch_m1 = msg["pitch_m1"];
        pitch_m2 = msg["pitch_m2"];
        pitch_m3 = msg["pitch_m3"];
        pitch_gi = msg["pitch_gi"];
        roll_m1 = msg["roll_m1"];
        roll_m2 = msg["roll_m2"];
        roll_m3 = msg["roll_m3"];
        roll_gi = msg["roll_gi"];
        yaw_m1 = msg["yaw_m1"];
        yaw_m2 = msg["yaw_m2"];
        yaw_m3 = msg["yaw_m3"];
        yaw_gi = msg["yaw_gi"];

        document.getElementById("pg").innerHTML = msg["pitch_gi"];
        document.getElementById("rg").innerHTML = msg["roll_gi"];
        document.getElementById("yg").innerHTML = msg["yaw_gi"];

        document.getElementById("p1").innerHTML = msg["pitch_m1"];
        document.getElementById("r1").innerHTML = msg["roll_m1"];
        document.getElementById("y1").innerHTML = msg["yaw_m1"];

        document.getElementById("p2").innerHTML = msg["pitch_m2"];
        document.getElementById("r2").innerHTML = msg["roll_m2"];
        document.getElementById("y2").innerHTML = msg["yaw_m2"];

        document.getElementById("p3").innerHTML = msg["pitch_m3"];
        document.getElementById("r3").innerHTML = msg["roll_m3"];
        document.getElementById("y3").innerHTML = msg["yaw_m3"];

        document.getElementById("pi").innerHTML = msg["pi"];
        document.getElementById("moderrimo").innerHTML = mode;

        document.getElementById("m1servo").innerHTML = parseFloat(msg["s_l"]).toFixed(1) + "º";
        document.getElementById("m2servo").innerHTML = parseFloat(msg["s_r"]).toFixed(1) + "º";

        document.getElementById("pm_l").innerHTML = parseFloat(msg["m_l"]).toFixed(1);
        document.getElementById("pm_r").innerHTML = parseFloat(msg["m_r"]).toFixed(1);

        document.getElementById("s0").innerHTML = parseFloat(msg["s0"]).toFixed(1);
        document.getElementById("s1").innerHTML = parseFloat(msg["s1"]).toFixed(1);
        document.getElementById("s2").innerHTML = parseFloat(msg["s2"]).toFixed(1);
        document.getElementById("s3").innerHTML = parseFloat(msg["s3"]).toFixed(1);
        document.getElementById("s4").innerHTML = parseFloat(msg["s4"]).toFixed(1);
    });
}, 1000);

var input = document.getElementById("input1");
input.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        ipcRenderer.send('command', input.value);
        if (input.value == "stop_stream") {
            document.getElementById("logs").style.display = "block";
            document.getElementById("imgstream").style.display = "none";

        }
        input.value = "";
    }
});

function commbutf(value) {
    mode = value;
    socket.emit('commbuts', value);
}
var caliblx = 0;
var calibly = 0;
var calibrx = 0;
var calibry = 0;
var lx = 0;
var ly = 0;
var rx = 0;
var ry = 0;

window.addEventListener('gamepadconnected', (event) => {
    console.log("Gamepads: " + navigator.getGamepads());
    const update = () => {
        var gp = navigator.getGamepads()[0];

        var b_x = gp.buttons[0];
        var b_r = gp.buttons[1];
        var b_c = gp.buttons[2];
        var b_t = gp.buttons[3];
        var l1 = gp.buttons[4];
        var l2 = gp.buttons[6];
        var r1 = gp.buttons[5];
        var r2 = gp.buttons[7];
        var up = gp.buttons[12];
        var down = gp.buttons[13];
        var left = gp.buttons[14];
        var right = gp.buttons[15];
        var start = gp.buttons[8];
        var select = gp.buttons[9];

        var aLX = gp.axes[2] - caliblx;
        var aLY = gp.axes[3] - calibly;

        var aRX = gp.axes[2] - calibrx;
        var aRY = gp.axes[3] - calibry;
        rx += +aRX;
        if (r1.pressed) {
            ly += +aLY * -0.5;
            if (ly < 0) {
                ly = 0
            }
            if (ly > 100) {
                ly = 100
            }
            aLX = 0
        }
        if (up.pressed) {
            ly = 0;
        }
        if (l1.pressed) {
            ly += +aLY * -5;
            if (ly < 0) {
                ly = 0
            }
            if (ly > 100) {
                ly = 100
            }
            aLX = 0
        }
        if (down.pressed) {
            aLX = 0;
        }
        document.getElementById("rightmotor").style.height = ly + "%";
        document.getElementById("leftmotor").style.height = ly + "%";

        document.getElementById("waybar").style.width = Math.abs(aLX) * 50 + "%";
        document.getElementById("waybar").style.marginLeft = (aLX) * 50 + "%";
        var client = {
            "mode": mode,
            "m_l": ly,
            "m_r": ly,
            "s0": 0,
            "s1": 0,
            "s2": 0,
            "s3": 0,
            "s4": 0,
            "s_l": aLX * 30,
            "s_r": aLX * -30,
        };
        console.log(ly);
        socket.emit("data", client)

        requestAnimationFrame(update);
    };
    update();
});

//Terminalvar 
$ = require('jquery');
require('jquery.terminal')($);
$('#patata').terminal({
    ls: function () {
        this.echo("[[b;#2864b3;]Assets  logs]  [[b;#1c8f4c;]main]  main.cpp  [[b;#2864b3;]Modules]  plane.code-workspace  README.md");
    },
    roger_bobo: function () {
        this.echo("COnfirmasion");
    },
    compile: function () {
        this.echo("[[b;#000;]Compiling started...]");
        this.echo("[[b;#000;]Compiling finished:] main");
    },
    reboot: function () {
        this.echo("Rebooting...");
    },
    echo: function (what) {
        this.echo(what);
    },
}, {
    greetings: '[[b;#000;]OrangePi SSH]'
});