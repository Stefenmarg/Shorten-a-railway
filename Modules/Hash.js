//Hashing library.
//This library will sha512 any String given to the function.
var crypto = require('crypto');
exports.genHash = (StrInput) => {
	//Checking string if it can be hashed and provide a salt.
    if (!StrInput || StrInput.length == 0) { throw "Provide input in genHash()." }
    try {
    	/*Create the salt */
        var salt = crypto.randomBytes(Math.ceil(StrInput.length/2)).toString('hex').slice(0,StrInput.length);
        /*Create the hash based on the salt*/
        var hash = crypto.createHmac('sha512', salt);
        var value = hash.update(StrInput).digest('hex');
        /*Return the hash and the salt in a json type object*/
        return { salt:salt, hash:value };
    } catch (err) { 
        /*error handling*/
    	console.log(err); 
    	return err;
    }
}