const express = require('express');

var Server = [];
Server.defaults = require('./defaults');

Server = Server.defaults.setup(Server);

Server.app = express();

Server.BackupManager.Backup(Server);
Server.BackupManager.backupInterval = setInterval(Server.BackupManager.Backup, Server.defaults.backupIntervalMS, Server); 

Server.app.get("/", (req, res) => { Server.Endpoints.index(req, res, Server); });
Server.app.get("/new", (req, res) => { Server.Endpoints.new(req, res, Server); });
Server.app.get("/takedown", (req, res) => { Server.Endpoints.takedown(req, res, Server); });
Server.app.get("/404", (req, res) => { Server.Endpoints.fof(req, res, Server); });
Server.app.get("/reg", Server.Endpoints.rateLimit, (req, res) => { Server.Endpoints.reg(req, res, Server); });
Server.app.get("/v/:id", Server.Endpoints.rateLimit, (req, res) => { Server.Endpoints.v(req, res, Server); });

Server.app.listen(Server.defaults.serverPort || 8000, () => {
	Server.LogManager.writeLog(Server, 'Notification', `Application listening on port: ${Server.defaults.serverPort || 8000}`);
})