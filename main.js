//Create window
const { app, BrowserWindow } = require('electron')
const path = require('path')
var fs = require('fs');

let mainWindow

const express = require("express");
const exp = express();
const http = require("http").Server(exp);

//Endolls
const io = require("socket.io")(http);
exp.use(express.static("app"));

//Endolls
const sp = require("serialport");


//Variables
var cont = false;
var plane = "";
var device = [];
var plane_file_log = "";

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1080,
		height: 720,
		frame: false,
		webPreferences: {
			webviewTag: true,
			nodeIntegration: true,
		}
	})

	mainWindow.loadFile('app/wifi/index.html')
	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', function () {

	createWindow();

	//WebServer

	//Startin webserver
	http.listen(9999, function () {
		console.log("Server Started");
	});

	//Endols
	io.on("connection", function (socket) {
		console.log(socket);
		new_connection(socket);
		socket.on("want", function (data) { client_demand(data, socket) });
		socket.on("sending", function (data) { plane_demand(data, socket) });
		socket.on("disconnect", function () { disconnect(socket) });
	});

})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	if (mainWindow === null) createWindow()
})

//SOCKET FUNCTIONS
function new_connection(socket) {
	var type_device = "Computer";
	console.log(socket["id"]);
	console.log(socket.handshake.headers['user-agent'])

	if (socket.handshake.headers['user-agent'] == "python-requests/2.18.4") {
		plane = socket.id
		type_device = "Plane";
		mainWindow.loadFile('app/wifi/index.html')
		mainWindow.maximize();

	} else {
		device.push(socket.id);
	}
	console.log("Connected " + type_device + ": " + socket.id)
	if (device != null && plane != null) {
		io.emit("devices", { "plane": plane });
	}
}

function client_demand(data, socket) {
	console.log(data);
	if (data == "image") {
		io.to(plane).emit("want", ["image", socket.id])
	}
}

function plane_demand(data, socket) {
	if (data[0] == "image") {
		socket.to(device[0]).emit("image", data[1]);
	}
	else if (data[0] == "data") {
		console.log(data[1]);
	}
}

function disconnect(socket) {
	console.log("Disconnected: " + socket.id)
	if (socket.id == plane) {
		plane = "";
		io.emit("devices", { "plane": false });
		/*mainWindow.loadFile('app/index.html');
		mainWindow.unmaximize();
		mainWindow.setBounds({width:700, height:400});*/
	} else {
		var td = device.indexOf(socket.id);
		device.splice(td, 1);
	}
}

/* USB */
sp.list().then(
	ports => {
		if (ports.length < 2) {

		}
	},
	err => {
		console.error('Error listing ports', err)
	}
)

const port = new sp('/dev/ttyUSB0', {
	baudRate: 115200
})

port.on('error', function (err) {
	console.log('Error: ', err.message)
})

port.on('readable', function () {
	console.log('Data:', port.read());
	if (!cont) {
		mainWindow.loadFile('app/uart/index.html')
		mainWindow.maximize();
		cont = true;
	}
	port.write("asd\n")
})