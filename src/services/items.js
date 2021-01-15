import { ObjectId } from 'mongodb';

export function getItems(collection, filtered) {
    return new Promise(
        function getAllItems(resolve, reject) {
            var where = filtered ? { publish: true } : {};
            collection.find(where).toArray()
            .then(
                (items) => resolve(items)
            ).catch(
                (err) => resolve([])
            );
        }
    );
}

export function getItem(collection, itemId) {
    return new Promise(
        function getItem(resolve, reject) {
            try {
                var mongoId = ObjectId(itemId);
            }
            catch (error) {
                reject({
                    code: 404,
                    message: 'Item not found ' + itemId
                });
                return;
            }

            collection.findOne(
                {_id: mongoId}
            ).then(
                (item) => {
                    if (!item) {
                        reject({
                            code: 404,
                            message: 'Item not found ' + itemId
                        });
                        return;
                    }
                    resolve(item);
                }
            ).catch(
                (err) => {
                    reject({
                        code: 404,
                        message: 'Item not found ' + itemId
                    });
                }
            );
        }
    );
}

export function inserItem(collection, item) {
    return new Promise(
        function insertItem(resolve, reject) {
            delete item._id;// Avoid using invalid id
            collection.insertOne(item)
            .then(
                (result) => {
                    if (result.insertedCount === 1) {
                        resolve({
                            ...item,
                            _id: result.insertedId
                        });
                        return;
                    }
                    reject({
                        code: 500,
                        message: 'Error saving item'
                    });
                }
            )
            .catch(
                (err) => {
                    reject({
                        code: 500,
                        message: 'Error saving item'
                    });
                }
            );
        }
    );
}

export function updateItem(collection, itemId, item) {
    return new Promise(
        function updateItem(resolve, reject) {
            try {
                var mongoId = ObjectId(itemId);
            }
            catch (error) {
                reject({
                    code: 404,
                    message: 'Item not found ' + itemId
                });
                return;
            }
            delete item._id;// Avoid using invalid id
            collection.updateOne(
                { _id: mongoId },
                { $set: item }
            ).then(
                (result) => {
                    if (result.result.ok === 1) {
                        getItem(
                            collection,
                            itemId
                        ).then(
                            resolve,
                            reject
                        );
                        return;
                    }
                    reject({
                        code: 500,
                        message: 'Error saving item'
                    });
                }
            )
            .catch(
                (err) => {
                    reject({
                        code: 500,
                        message: 'Error updating item'
                    });
                }
            );
        }
    );
}

export function deleteItem(collection, itemId) {
    return new Promise(
        function deleteItem(resolve, reject) {

            try {
                var mongoId = ObjectId(itemId);
            }
            catch (error) {
                reject({
                    code: 404,
                    message: 'Item not found ' + itemId
                });
                return;
            }

            getItem(
                collection,
                itemId
            ).then(
                (item) => {
                    collection.deleteOne(
                        { _id: mongoId }
                    ).then(
                        (result) => {
                            if (result.deletedCount === 1) {
                                delete item._id;
                                resolve(item);
                                return;
                            }
                            reject({
                                code: 404,
                                message: 'Item not found ' + itemId
                            });
                        },
                        (error) => {
                            reject({
                                code: 500,
                                message: 'Error deleting item'
                            });
                        }
                    );
                }
            ).catch(reject);
}
    );
}
