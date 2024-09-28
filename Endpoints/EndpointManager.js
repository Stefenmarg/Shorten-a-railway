const RateLimit = require('express-rate-limit');
const path = require('path');

exports.rateLimit = RateLimit({
  	windowMs: 25 * 60 * 1000,
  	max: 7,
  	message: { Status: 'Failure', Responce: 'Too many API requests from this IP, please try again later.'},
  	standardHeaders: true, 
  	legacyHeaders: false
});

exports.index = (req, res, Server) => { res.sendFile(path.resolve(__dirname, `./Files/index.html`)); }
exports.new = (req, res, Server) => { res.sendFile(path.resolve(__dirname, `./Files/new.html`)); }
exports.takedown = (req, res, Server) => {  res.sendFile(path.resolve(__dirname, `./Files/takedown.html`)); }
exports.fof = (req, res, Server) => {  res.sendFile(path.resolve(__dirname, `./Files/404.html`)); }

exports.reg = (req, res, Server) => {
	if (!Server.Validator.isValidURL(req.query["url"])) {
		res.json({ Status: "Failure", Responce: "Incorrect URL formation; Insert correct URL."});
		return;
	}
	if (!Server.Validator.isValidEmail(req.query["email"])) {
		res.json({ Status: "Failure", Responce: "Incorrect email formation; Insert correct Email."});
		return;
	}
	Server.DatabaseManager.postNewRedirectURL(Server, req.query["url"], req.query["email"], (err, rows) => {
		if (err) { 
			console.log(err); 
			Server.LogManager.writeLog(Server, 'Error', err); 
			res.json({ Status: "Failure", Responce: "Database error occured; please try again later. If the error persist please contact the admins of the site."});
		} else {
			res.json({ Status: "Success", Responce: rows["ID"]});
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