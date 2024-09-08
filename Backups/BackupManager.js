const fs = require("fs");

exports.backupInterval;

exports.Backup = (Server) => {
	const startTime = new Date();
	const backupDate = `${startTime.toDateString().split(" ").join("_")}_${startTime.getHours()}_${startTime.getMinutes()}_${startTime.getSeconds()}`;

	fs.mkdir(`${Server.defaults.backupFolder}/${backupDate}`, { recursive: true }, (err) => {
		if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); throw err; }
	});
	
	for (item in Server.defaults.backupPaths){
		fs.cp(`${Server.defaults.backupPaths[item]}`, `${Server.defaults.backupFolder}/${backupDate}/${Server.defaults.backupPaths[item]}`, {recursive: true}, (err) => {
			if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); throw err; }
		});
	}
	Server.LogManager.writeLog(Server, 'Notifications', `Made a full backup; took ${new Date() - startTime} ms.`);
}
