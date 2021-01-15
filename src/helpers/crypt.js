import bcrypt from 'bcrypt';

/**
* The method generates, given a value, an hash using a salt
*
* @method generateHash
* @param {String} value the value to be hashed
* @return {Object} Returns the promise of an hash value
*/
function generateHash(value) {
    return new Promise(function(resolve, reject) {
        const ROUNDS = 10;
        bcrypt.genSalt(ROUNDS, function generateSalt(saltErr, salt) {
            if (saltErr) {
                reject(saltErr);
                return;
            }

            bcrypt.hash(value, salt, function handleHash(hashErr, hash) {
                if (hashErr) {
                    reject(hashErr);
                    return;
                }
                resolve(hash);
            });
        });
    });
}


/**
* The method compares two hashes
*
* @method compareHash
* @param {String} hash1 hash to compare with
* @param {String} hash2 hash to compare with
* @return {Object} Returns the promise of a comparasion between two hashes
*/
function compareHash(hash1, hash2) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(hash1, hash2, function(err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

let cryptography = {
        generateHash: generateHash,
        compareHash: compareHash
    };
export default cryptography;
