export function findConfig(configCollection, configName) {
    return new Promise(function findConfiguration(resolve, reject) {
        return configCollection
            .findOne({ _id: configName })
            .then(data => {
                if (!data) {
                    reject({
                        code: 404,
                        message: `config for ${configName} not found`
                    });
                    return;
                }
                let { _id, ...config } = data;
                resolve(config);
            })
            .catch(error => {
                reject({
                    code: 404,
                    message: `config for ${configName} not found`
                });
            });
    });
}

export function createConfig(configCollection, game, config) {
    /*
    {
        token: '104f63e4-fcd7-11e6-af62-005056992599',
        points: 100,
        promotion: 0,
        invitation: '21de3f18-fcd7-11e6-af62-005056992599'
    }
    */
    return new Promise(function createConfig(resolve, reject) {
        // Safeguard
        if (!game) {
            reject({
                code: '412',
                message: 'invalid arguments'
            });
        }
        const newConfig = {
            _id: game,
            ...config
        };
        configCollection
            .findOneAndUpdate(
                {
                    _id: game
                },
                {
                    $set: newConfig
                },
                {
                    upsert: true,
                    returnOriginal: false
                }
            )
            .then(function fulfilledInsert(operation) {
                if (operation && operation.ok) {
                    let saved = operation.value,
                        { _id, ...response } = saved;
                    resolve(response);
                    return;
                }

                reject({
                    code: 500,
                    message: 'Error: invitation not saved in mongo'
                });
            })
            .catch(function errorMongo(error) {
                reject({
                    code: 500,
                    message: error.message
                });
            });
    });
}

export function resetConfig(configCollection, game, config) {
    /*
    {
        token: '104f63e4-fcd7-11e6-af62-005056992599',
        points: 100,
        promotion: 0,
        invitation: '21de3f18-fcd7-11e6-af62-005056992599'
    }
    */
    return new Promise(function resetConfig(resolve, reject) {
        // Safeguard
        if (!game) {
            reject({
                code: '412',
                message: 'invalid arguments'
            });
        }
        const newConfig = {
            _id: game,
            ...config
        };
        configCollection
            .replaceOne(
                {
                    _id: game
                },
                newConfig,
                {
                    upsert: true,
                    returnOriginal: false
                }
            )
            .then(function fulfilledInsert(operation) {
                if (operation.result && operation.result.ok) {
                    let saved = operation.ops[0],
                        { _id, ...response } = saved;
                    resolve(response);
                    return;
                }

                reject({
                    code: 500,
                    message: 'Error: invitation not saved in mongo'
                });
            })
            .catch(function errorMongo(error) {
                reject({
                    code: 500,
                    message: error.message
                });
            });
    });
}
