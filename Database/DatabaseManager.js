//Using verbose for better error messages.
const sqlite3 = require('sqlite3').verbose();
const Hash = require('../Modules/Hash.js');


exports.connectDB = (Server) => {
	//Create new Database object and save it to the Server object
	Server.DB = new sqlite3.Database(`${Server.defaults.databasePath}`, sqlite3.OPEN_READWRITE, (err) => {
		if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); throw err; } // Error handling
		Server.LogManager.writeLog(Server, 'Notification', `Connected to database: ${Server.defaults.databasePath}`); // Write log that the database was connected.
	});
	//Return the changed server object.
	return Server;
}

exports.getRedirectURL = (Server, ID, callback) => {
	//Make a qet qury to the database
	Server.DB.get(`SELECT URL FROM Links WHERE ID = ?`, [ID], (err, rows) => {
		if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); callback(err); } // Error handling
		Server.LogManager.writeLog(Server, 'Queries', `SELECT URL FROM Links WHERE ID = ${ID};`);//Writing in the logs the execution of a query.
		callback(null, rows); // fullfil callback
	});
}

exports.postNewRedirectURL = (Server, URL, Email, callback) => {
	const newEntry = Hash.genHash(Email); //Generate  hash and salt
	delete Email;

	Server.DB.serialize(() => {
		//Create the commands that need to be executed.
		const Statement1 = `INSERT INTO links (URL, DATE, EMAIL_HASH, EMAIL_SALT) VALUES ("${URL}", "${new Date()}", "${newEntry['hash']}", "${newEntry['salt']}");`;
		const Statement2 = `SELECT ID FROM links WHERE EMAIL_SALT = "${newEntry["salt"]}";`;

		Server.DB.run(`${Statement1}`, (err) => {
			if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err);callback(err); } //Error handling
			Server.LogManager.writeLog(Server, 'Queries', Statement1); //Log the query
		}).get(`${Statement2}`, (err, rows) => {
			if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); callback(err); } //Error handling
			Server.LogManager.writeLog(Server, 'Queries', Statement2); // Log the query
			callback(null, rows); //fullfil callback
		});
	});
}