const express = require('express');
const path = require('path');

var Server = [];
Server.defaults = require('./defaults');//Import all the default settings
Server = Server.defaults.setup(Server); //Setup all the managers of the service.

Server.app = express(); //Create express object

/*Setup of backup function & boot backup & backup interval*/
Server.BackupManager.Backup(Server); 
Server.BackupManager.backupInterval = setInterval(Server.BackupManager.Backup, Server.defaults.backupIntervalMS, Server);

/* Registration of all the static file responding endpoints */
Server.app.get("/", (req, res) => { 
	res.sendFile(path.resolve(__dirname, `./Endpoints/Files/index.html`)); 
});

Server.app.get("/new", (req, res) => {
	res.sendFile(path.resolve(__dirname, `./Endpoints/Files/new.html`));
});

Server.app.get("/takedown", (req, res) => {
	res.sendFile(path.resolve(__dirname, `./Endpoints/Files/takedown.html`));
});

Server.app.get("/404", (req, res) => {
	res.sendFile(path.resolve(__dirname, `./Endpoints/Files/404.html`));
});

/*Sending reguest info and responce ability to manager for the appropriate actions by the API.*/
Server.app.get("/reg", Server.Endpoints.rateLimit, (req, res) => {
	Server.Endpoints.reg(req, res, Server);
});

Server.app.get("/v/:id", Server.Endpoints.rateLimit, (req, res) => {
	Server.Endpoints.v(req, res, Server);
});

//Make the servce listen to the default port OR port 8000 if default is not defined.
Server.app.listen(Server.defaults.serverPort || 8000, () => {
	Server.LogManager.writeLog(Server, 'Notification', `Application listening on port: ${Server.defaults.serverPort || 8000}`); //Write log about launch 
})