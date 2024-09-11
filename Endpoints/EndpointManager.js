const RateLimit = require('express-rate-limit');
const path = require('path');

exports.rateLimit = RateLimit({
  	windowMs: 25 * 60 * 1000,
  	max: 7,
  	message: "Too many API requests from this IP, please try again later.",
  	standardHeaders: true, 
  	legacyHeaders: false
});

exports.index = (req, res, Server) => { res.sendFile(path.resolve(__dirname, `./Files/index.html`)); }
exports.new = (req, res, Server) => { res.sendFile(path.resolve(__dirname, `./Files/new.html`)); }
exports.takedown = (req, res, Server) => {  res.sendFile(path.resolve(__dirname, `./Files/takedown.html`)); }
exports.fof = (req, res, Server) => {  res.sendFile(path.resolve(__dirname, `./Files/404.html`)); }

exports.reg = (req, res, Server) => {
	Server.DatabaseManager.postNewRedirectURL(Server, req.query["url"], req.query["email"], (err, rows) => {
		var Status = 'Success'
		var Responce;
		if (err) { 
			console.log(err); 
			Server.LogManager.writeLog(Server, 'Error', err); 
			res.json(JSON.stringify({ Status: `Failure`, Responce: 'Database error occured; please try again later. If the error persist please contact the admins of the site.'}));
		} else {
			res.json(JSON.stringify({ Status: `Success`, Responce: `Your shortened link can now be found in /v/${rows["ID"]}`}));
		}
	});
} 

exports.v = (req, res, Server) => {
	Server.DatabaseManager.getRedirectURL(Server, req.params["id"], (err, rows) => {
		if (err) { console.log(`err: ${err}`); Server.LogManager.writeLog(Server, 'Error', err);  res.sendFile(path.resolve(__dirname, `${Server.defaults.serverFrontEnd}/404.html`)); return;}
		if (typeof rows == 'undefined') { res.sendFile(path.resolve(__dirname, `./Files/404.html`)); return; }
		res.redirect(rows["URL"]);
	})
}