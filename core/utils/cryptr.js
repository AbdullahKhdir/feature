const Cryptr = require('cryptr');
const { encryption_key } = require('../config');

const cryptr = new Cryptr(encryption_key);

const encrypt = (string) => {
    return cryptr.encrypt(string);
}

const decrypt = (string) => {
    return cryptr.decrypt(string);
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;