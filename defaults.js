exports.setup = (Server) => {
	//Importing all the managers of this application.
	Server.BackupManager = require('./Backups/BackupManager'); 
	Server.DatabaseManager = require('./Database/DatabaseManager');
	Server.LogManager = require("./Logs/LogManager");
	Server.Endpoints = require('./Endpoints/EndpointManager');
	
	//Connect the database
	Server = Server.DatabaseManager.connectDB(Server);
	
	//Return everything tht is imported
	return Server;
}

//The path to the main Database.
exports.databasePath = "./Database/Files/main.db"

//Time in milliseconds between last and next backup.
exports.backupIntervalMS = 1800000;

//The folder in which the backups should be saved.
exports.backupFolder = "./Backups/Files"

//All the paths that should be copied and have a backup.s
exports.backupPaths = ["./Database/Files", "./Logs/Files"]

//all the diffrent types of logs that can be used in the service.
exports.logTypes = ["Error", "Warning", "Notification", "Queries", "Uncategorised"];

//the path in which the logs will be saved.
exports.logPath = "./Logs/Files/";

//the port that the API & Server should listen to.
exports.serverPort = 4000;