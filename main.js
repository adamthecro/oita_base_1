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

	mainWindow.loadFile('app/index.html')
	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', function () {

	createWindow();

})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	if (mainWindow === null) createWindow()
})