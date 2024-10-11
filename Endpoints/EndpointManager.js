const RateLimit = require('express-rate-limit');
const path = require('path');

/* Creaation of rate limit rule & reply for being ratelimited */
exports.rateLimit = RateLimit({
  	windowMs: 25 * 60 * 1000,
  	max: 7,
  	message: { Status: 'Failure', Responce: 'Too many API requests from this IP, please try again later.'},
  	standardHeaders: true, 
  	legacyHeaders: false
});

exports.reg = (req, res, Server) => {
	/* First check: is the url given to shorten "valid" */
	if (!Server.Validator.isValidURL(req.query["url"])) {
		res.json({ Status: "Failure", Responce: "Incorrect URL formation; Insert correct URL."});
		return;
	}
	/*Second check: is the email given for the registration "valid" */
	if (!Server.Validator.isValidEmail(req.query["email"])) {
		res.json({ Status: "Failure", Responce: "Incorrect email formation; Insert correct Email."});
		return;
	}
	/*If all is correct, continue with the database write and send responce with the site's id.*/
	Server.DatabaseManager.postNewRedirectURL(Server, req.query["url"], req.query["email"], (err, rows) => {
		/* Error handling */
		if (err) { 
			console.log(err); 
			/* Log the error */
			Server.LogManager.writeLog(Server, 'Error', err); 
			/* respond with the error */
			res.json({ Status: "Failure", Responce: "Database error occured; please try again later. If the error persist please contact the admins of the site."});
		} else {
			/* respond with the site's id */
			res.json({ Status: "Success", Responce: rows["ID"]});
		}
	});
} 

exports.v = (req, res, Server) => {
	/* Query for the id given and get a url back. */
	Server.DatabaseManager.getRedirectURL(Server, req.params["id"], (err, rows) => {
		/* if error occurs return 404 page and exit */
		if (err) {  
			Server.LogManager.writeLog(Server, 'Error', err);  
			res.sendFile(path.resolve(__dirname, `./Files/404.html`));
			return;
		}
		/*If the site is not found in the database return the 404 page and exit */
		if (typeof rows == 'undefined') {
			res.sendFile(path.resolve(__dirname, `./Files/404.html`));
			return; 
		}
		/*if found the site and (temporary code) redirected ueser to the site requested */
		res.redirect(302, rows["URL"]);
	});
}