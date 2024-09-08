/*

*/
const sqlite3 = require('sqlite3').verbose();
const Hash = require('../Modules/Hash.js')

exports.connectDB = (Server) => {
	Server.DB = new sqlite3.Database(`${Server.defaults.databasePath}`, sqlite3.OPEN_READWRITE, (err) => {
		if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); throw err; }
		Server.LogManager.writeLog(Server, 'Notifications', `Connected to database: ${Server.defaults.databasePath}`);
	})
	return Server;
}

exports.getRedirectURL = (Server, ID, callback) => {
	Server.DB.get(`SELECT URL FROM Links WHERE ID = ?`, [ID], (err, rows) => {
		if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); callback(err) }
		Server.LogManager.writeLog(Server, 'Queries', `SELECT URL FROM Links WHERE ID = ${ID};`);
		callback(null, rows);
	});
}

exports.postNewRedirectURL = (Server, URL, Email, callback) => {
	const newEntry = Hash.genHash(Email); 
	delete Email;

	Server.DB.serialize(() => {
		const Statement1 = `INSERT INTO links (URL, DATE, EMAIL_HASH, EMAIL_SALT) VALUES ("${URL}", "${new Date()}", "${newEntry['hash']}", "${newEntry['salt']}");`;
		const Statement2 = `SELECT ID FROM links WHERE EMAIL_SALT = "${newEntry["salt"]}";`;

		Server.DB.run(`${Statement1}`, (err) => {
			if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err);callback(err); }
			Server.LogManager.writeLog(Server, 'Queries', Statement1);
		}).get(`${Statement2}`, (err, rows) => {
			if (err) { console.log(err); Server.LogManager.writeLog(Server, 'Error', err); callback(err); }
			Server.LogManager.writeLog(Server, 'Queries', Statement2);
			callback(null, rows);
		});
	});
}