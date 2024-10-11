const fs = require('fs');

exports.writeLog = (Server, LogType, LogContent, PassVerbosityCheck) => {
	/* Checking if the category of the log is in the list 
	of the topics that have seperate files ex. Query */
	if (!Server.defaults.logTypes.includes(LogType)) {
		/* Set log type to default for uncategorised log types */
		LogType = Server.defaults.logTypes[Server.defaults.logTypes.length-1];
	}

	/* Creation of the log file and writting log content */
	fs.appendFile(`${Server.defaults.logPath}/${LogType}.log`, `${LogContent} \n`, (err) => {
		/* Error handling */
		if (err) { 
			console.log(err); 
			throw err;
		}
		/* Write in the console the log type & content only is settting for verbose is true */
		if (Server.defaults.verbose || PassVerbosityCheck){
			console.log(`Wrote in the ${LogType} log file: > [${LogContent}]`);
		}
	});
}