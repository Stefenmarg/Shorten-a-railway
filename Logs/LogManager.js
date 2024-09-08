/**/
const fs = require('fs');
exports.writeLog = (Server, LogType, LogContent) => {
	if (!Server.defaults.logTypes.includes(LogType)) {
		LogType = Server.defaults.logTypes[Server.defaults.logTypes.length-1]
	}
	fs.appendFile(`${Server.defaults.logPath}/${LogType}.log`, `${LogContent} \n`, (err) => {
		if (err) { console.log(err); throw err;}
		console.log(`Wrote in the ${LogType} log file: > [${LogContent}]`);
	});
}