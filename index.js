const express = require('express');

var Server = []; //Create blank srver object
Server.defaults = require('./defaults');//Import all the default settings

Server = Server.defaults.setup(Server); //Setup all the managers of the service.

Server.app = express(); //Create express object

Server.BackupManager.Backup(Server); //create backup at launch
Server.BackupManager.backupInterval = setInterval(Server.BackupManager.Backup, Server.defaults.backupIntervalMS, Server);  //Create backup as per the intervals

//Register all of the endpoints that the service is gonna need to function and redirect the variables to the handlers of the endpoints.
Server.app.get("/", (req, res) => { Server.Endpoints.index(req, res, Server); });
Server.app.get("/new", (req, res) => { Server.Endpoints.new(req, res, Server); });
Server.app.get("/takedown", (req, res) => { Server.Endpoints.takedown(req, res, Server); });
Server.app.get("/404", (req, res) => { Server.Endpoints.fof(req, res, Server); });

//In this endpoint the ratelimiting is set as to not allow for overuse of the platform.
Server.app.get("/reg", Server.Endpoints.rateLimit, (req, res) => { Server.Endpoints.reg(req, res, Server); });
Server.app.get("/v/:id", Server.Endpoints.rateLimit, (req, res) => { Server.Endpoints.v(req, res, Server); });

//Make the servce listen to the default port OR port 8000 if default is not defined.
Server.app.listen(Server.defaults.serverPort || 8000, () => {
	Server.LogManager.writeLog(Server, 'Notification', `Application listening on port: ${Server.defaults.serverPort || 8000}`); //Write log about launch 
})