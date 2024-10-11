var crypto = require('crypto');
exports.generateHash = (String, callback) => {
	if (!String || String.length == 0) { 
		throw "Provide input in genHash()." 
	}
	try {
	    var salt = crypto.randomBytes(Math.ceil(String.length/2)).toString('hex').slice(0,String.length);
	    var hash = crypto.createHmac('sha512', salt);
	    var value = hash.update(String).digest('hex');
    	callback(null, { salt:salt, hash:value })
	} catch (err) {
		callback(err);
	}
}