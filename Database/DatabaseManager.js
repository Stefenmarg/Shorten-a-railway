//Using verbose for better error messages.
const sqlite3 = require('sqlite3').verbose();
const Hash = require('../Modules/Hash.js');


exports.connectDB = (Server) => {
	/*Create new Database object and save it to the Server object*/
	Server.DB = new sqlite3.Database(`${Server.defaults.databasePath}`, sqlite3.OPEN_READWRITE, (err) => {
		/* error handling */
		if (err) { 
			console.log(err); 
			Server.LogManager.writeLog(Server, 'Error', err); 
			throw err; 
		}
		/* Write when connected */
		Server.LogManager.writeLog(Server, 'Notification', `Connected to database: ${Server.defaults.databasePath}`); // Write log that the database was connected.
	});
	/*Return the changed server object.*/
	return Server;
}

exports.getRedirectURL = (Server, ID, callback) => {
	/*Make a search query to the database to find the url of the site with the id given*/
	Server.DB.get(`SELECT URL FROM Links WHERE ID = ?`, [ID], (err, rows) => {
		/*error handling*/
		if (err) { 
			console.log(err); 
			Server.LogManager.writeLog(Server, 'Error', err); 
			/*error out callback*/
			callback(err);
		}
		/*Save query info just in case*/
		Server.LogManager.writeLog(Server, 'Queries', `SELECT URL FROM Links WHERE ID = ${ID};`);//Writing in the logs the execution of a query.
		/*return successful raw data to the funxtion above in the stack to manage the data */
		callback(null, rows);
	});
}

exports.postNewRedirectURL = (Server, URL, Email, callback) => {
	/* Generate a new pair of hash and salt*/
	const newEntry = Hash.genHash(Email);
	/*Delete the email that was provided */
	delete Email;

	Server.DB.serialize(() => {
		/*Create the statements of the commands that need to be executed.*/
		const Statement1 = `INSERT INTO links (URL, DATE, EMAIL_HASH, EMAIL_SALT) VALUES ("${URL}", "${new Date()}", "${newEntry['hash']}", "${newEntry['salt']}");`;
		const Statement2 = `SELECT ID FROM links WHERE EMAIL_SALT = "${newEntry["salt"]}";`;

		/* Running the first then the second statement */
		Server.DB.run(`${Statement1}`, (err) => {
			/* Error handling */
			if (err) { 
				console.log(err); 
				Server.LogManager.writeLog(Server, 'Error', err);
				/* send error in the callback and null data */
				callback(err);
			}
			/*Log the query just in case */
			Server.LogManager.writeLog(Server, 'Queries', Statement1);
		}).get(`${Statement2}`, (err, rows) => {
			/* Error handling */
			if (err) { 
				console.log(err); 
				Server.LogManager.writeLog(Server, 'Error', err); 
				callback(err);
			} 
			/* Log the query just in case */
			Server.LogManager.writeLog(Server, 'Queries', Statement2);
			/*fullfil the callback and provide the raw result */
			callback(null, rows); 
		});
	});
}