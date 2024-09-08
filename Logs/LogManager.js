/**/
const fs = require('fs');
exports.writeLog = (Server, LogType, LogContent) => {
	//heck if this type of log is in the acceptable list
	if (!Server.defaults.logTypes.includes(LogType)) {
		LogType = Server.defaults.logTypes[Server.defaults.logTypes.length-1]
	}
	//Create the log file (if it doesn't exist) and write it to the log file
	fs.appendFile(`${Server.defaults.logPath}/${LogType}.log`, `${LogContent} \n`, (err) => {
		if (err) { console.log(err); throw err;}
		console.log(`Wrote in the ${LogType} log file: > [${LogContent}]`);
	});
}