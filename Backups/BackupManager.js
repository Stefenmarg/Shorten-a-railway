const fs = require("fs");

//The variable that we put the setInterval into in the index.js file at root.
exports.backupInterval;

exports.Backup = (Server) => {
	//Getting the start time of the backup
	const startTime = new Date();
	//Creating the directory's path name with the time attributes.
	const backupDate = `${startTime.toDateString().split(" ").join("_")}_${startTime.getHours()}_${startTime.getMinutes()}_${startTime.getSeconds()}`;

	//Making the above mentioned direcoty
	fs.mkdir(`${Server.defaults.backupFolder}/${backupDate}`, { recursive: true }, (err) => {
		if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); throw err; } //Error handling
	});
	
	//For every firectory that needs to be backed up
	for (item in Server.defaults.backupPaths){
		//Copy the directory & it's content into the backup file mentioned above
		fs.cp(`${Server.defaults.backupPaths[item]}`, `${Server.defaults.backupFolder}/${backupDate}/${Server.defaults.backupPaths[item]}`, {recursive: true}, (err) => {
			if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); throw err; } // Error handling
		});
	}
	 //Logging that there was a backup made.
	Server.LogManager.writeLog(Server, 'Notification', `Made a full backup; took ${new Date() - startTime} ms.`);
}
