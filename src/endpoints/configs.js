import express from 'express';
import { findConfig, createConfig, resetConfig } from '../services/configs';

export default function configsRoute(gameConfigCollection) {
    var router = express.Router();

    router.get('/', function getConfig(req, res) {
        const { user } = req;
        console.log('GET /config', user);
        findConfig(gameConfigCollection, user.game)
            .then(config => {
                res.status(200).json(config);
            })
            .catch(error => {
                console.log('Error findConfig', error);
                res.status(404).json({
                    code: 404,
                    message: error.message
                });
            });
    });

    router.put('/', function putConfig(req, res) {
        const { user } = req;
        console.log('PUT /config', user);
        createConfig(gameConfigCollection, user.game, req.body)
            .then(config => {
                res.status(200).json(config);
            })
            .catch(error => {
                res.status(500).json({
                    code: 500,
                    message: error.message
                });
            });
    });

    router.post('/', function postConfig(req, res) {
        const { user } = req;
        console.log('POST /config', user);
        resetConfig(gameConfigCollection, user.game, req.body)
            .then(config => {
                res.status(200).json(config);
            })
            .catch(error => {
                res.status(500).json({
                    code: 500,
                    message: error.message
                });
            });
    });

    return router;
}
