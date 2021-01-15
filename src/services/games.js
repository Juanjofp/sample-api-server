
export function findGame(gameCollection, invitation) {
    console.log('findGame', invitation);
    return new Promise(
        function findInvitationById(resolve, reject) {
            return gameCollection
            .findOne(
                { _id: invitation }
            ).then(
                (data) => {
                    console.log('findInvitation', data);
                    if (!data) {
                        reject({
                            code: 404,
                            message: 'Inivitation not found'
                        });
                        return;
                    }
                    let game = {
                        invitation: data._id,
                        ...data
                    };
                    resolve(game);
                }
            ).catch(
                (error) => {
                    console.log('Invalid invitation');
                    reject({
                        code: 404,
                        message: 'Inivitation not found'
                    });
                }
            );
        }
    );
}

export function createGame(gameCollection, game) {
    /*
    {
        token: '104f63e4-fcd7-11e6-af62-005056992599',
        points: 100,
        promotion: 0,
        invitation: '21de3f18-fcd7-11e6-af62-005056992599'
    }
    */
    return new Promise(
        function createGame(resolve, reject) {
            // Safeguard
            if (
                !game.invitation || !game.token || !game.game
            ) {
                reject({
                    code: '412',
                    message: 'invalid arguments'
                });
            }
            gameCollection.findOneAndUpdate(
                {
                    _id: game.invitation
                },
                {
                    $set: {
                        _id: game.invitation,
                        ...game,
                        token: game.token,
                        game: game.game,
                        points: game.points || 100,
                        promotion: game.promotion || 0,
                    }
                },
                {
                    upsert: true,
                    returnOriginal: false
                }
            ).then(
                function fulfilledInsert(operation) {
                    if (operation && operation.ok) {
                        let saved = operation.value;
                        let game = {
                            invitation: saved._id,
                            ...saved
                        };
                        delete game._id;
                        resolve(game);
                        return;
                    }

                    reject({
                        code: 500,
                        message: 'Error: invitation not saved in mongo'
                    });
                }
            ).catch(function errorMongo(error) {
                reject({
                    code: 500,
                    message: error.message
                });
            });
        }
    );
}

export function addGamePlay(gameCollection, game, gameResult) {
    return new Promise(
        (resolve, reject) => {
            gameCollection.updateOne(
                { _id: game.invitation },
                { $push: { results: gameResult } }
            ).then(
                (operation) => {
                    if (operation.result && operation.result.ok) {
                        resolve(game);
                        return;
                    }
                    reject({ code: 500, message: 'Updated fails' });
                }
            ).catch(
                (error) => reject({ code: 500, message: error.message })
            );
        }
    );
}
