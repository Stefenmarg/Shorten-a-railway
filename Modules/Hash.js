//Hashing library.
//This library will sha512 any String given to the function.
var crypto = require('crypto');
exports.genHash = (StrInput) => {
    if (!StrInput || StrInput.length == 0) { throw "Provide input in genHash()." }
    try {
        var salt = crypto.randomBytes(Math.ceil(StrInput.length/2)).toString('hex').slice(0,StrInput.length);
        var hash = crypto.createHmac('sha512', salt);
        var value = hash.update(StrInput).digest('hex');
        return { salt:salt, hash:value };
    } catch (err) { console.log(err); return err; }
}