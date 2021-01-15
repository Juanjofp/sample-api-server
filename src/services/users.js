import cryptography from '../helpers/crypt';

function mongoError(error) {
    var err = error || {}; // Pending to thing about error codes
    err.code = 500;
    err.message = 'Mongo Error';
    return err;
}

function passwordError(error) {
    var err = error || {}; // Pending to thing about error codes
    err.code = 422;
    err.message = 'User and password do not match';
    return err;
}

export function createUser(userCollection, username, password, game) {
    return new Promise(function(resolve, reject) {
        cryptography.generateHash(password).then(
            function fulfilledHash(hash) {
                userCollection.insertOne({
                    _id: username,
                    password: hash,
                    displayname: username,
                    game: game
                })
                .then(
                    function fulfilledInsert(operation) {
                        if (operation && operation.result && operation.result.ok) {
                            let user = operation.ops[0];
                            user.username = user._id;
                            delete user._id;
                            delete user.password;
                            resolve(user);
                            return;
                        }

                        reject({
                            code: 500,
                            message: 'Error: user not saved in mongo'
                        });
                    },
                    function rejectedInsert(error) {
                        var err = error || {}; // Pending to thing about error codes
                        err.code = 409;
                        err.message = 'User already exists';
                        reject(err);
                    }
                ).catch(function errorMongo(err) {
                    reject(mongoError(err));
                });
            },
            function rejectedHash(error) {
                var err = error || {}; // Pending to thing about error codes
                err.code = 412;
                err.message = 'Error generating hash';
                reject(err);
            }
        ).catch(function errorMongo(err) {
            reject(mongoError(err));
        });
    });
}

export function findUserById(userCollection, username) {
    return new Promise(function findUserByIdPromise(resolve, reject) {
        userCollection.aggregate([
                {
                    '$match': {_id: username}
                },
                {
                    '$project': {
                        '_id': 0,
                        'username': '$_id',
                        'password': 1,
                        'game': 1,
                        'displayname': 1
                    }
                }
            ],
            function findUser(err, data) {
                console.log('findById', err, data);
                if (err || !data || data.length === 0) {
                    console.log('Rejecting findUserById');
                    reject({code: 404, message: 'User not found'});
                }
                else {
                    resolve(data[0]);
                }
            }
        );
    });
}

export function checkPassword(password, user) {
    return new Promise(function checkPasswordPromise(resolve, reject) {
        cryptography.compareHash(password, user.password)
        .then(
            function passwordChecked(isOk) {
                if (isOk) {
                    delete user.password;
                    resolve(user);
                    return;
                }
                reject(passwordError());
            }
        ).catch(function passwordErrorPromise(err) {
            reject(passwordError());
        });
    });
}
