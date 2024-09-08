exports.setup = (Server) => {
	Server.BackupManager = require('./Backups/BackupManager'); 
	Server.DatabaseManager = require('./Database/DatabaseManager');
	Server.LogManager = require("./Logs/LogManager");
	Server.Endpoints = require('./Endpoints/EndpointManager');

	Server = Server.DatabaseManager.connectDB(Server);
	return Server;
}

exports.databasePath = "./Database/Files/main.db"

exports.backupIntervalMS = 1800000;
exports.backupFolder = "./Backups/Files"
exports.backupPaths = ["./Database/Files", "./Logs/Files"]

exports.logTypes = ["Error", "Warning", "Notification", "Queries", "Uncategorised"]
exports.logPath = "./Logs/Files/";

exports.serverPort = 4000;