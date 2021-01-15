import express from 'express';
import {
    getItems,
    getItem,
    inserItem,
    updateItem,
    deleteItem
} from '../services/items';

export default function itemsRoute(mongo) {
    var router = express.Router();

    router.get('/', function getAllItemsFromGame(req, res) {
        const { user } = req;
        console.log('GET /', user);
        getItems(mongo.collection(user.game), false).then(items =>
            res.status(200).json(items)
        );
    });

    router.get('/:id', function getItemFromGame(req, res) {
        const { user } = req;
        console.log('GET /' + req.params.id, user);
        getItem(mongo.collection(user.game), req.params.id)
            .then(item => {
                res.status(200).json(item);
            })
            .catch(err => {
                res.status(err.code).json(err);
            });
    });

    router.post('/', function insertItemInGame(req, res) {
        const { user } = req;
        console.log('POST /', user);

        inserItem(mongo.collection(user.game), req.body)
            .then(item => {
                res.status(200).json(item);
            })
            .catch(err => {
                res.status(err.code).json(err);
            });
    });

    router.put('/:id', function updateItemInGame(req, res) {
        const { user } = req,
            { id: itemId } = req.params;
        console.log('PUT /', user.username, itemId);

        updateItem(mongo.collection(user.game), itemId, req.body)
            .then(item => {
                res.status(200).json(item);
            })
            .catch(err => {
                res.status(err.code).json(err);
            });
    });

    router.delete('/:id', function postConfig(req, res) {
        const { user } = req,
            { id: itemId } = req.params;
        console.log('DELETE /', user.username, itemId);

        deleteItem(mongo.collection(user.game), itemId)
            .then(item => {
                res.status(200).json(item);
            })
            .catch(err => {
                res.status(err.code).json(err);
            });
    });

    return router;
}
