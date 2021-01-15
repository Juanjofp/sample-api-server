import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import multer from 'multer';

import config from './config';
import cors from './helpers/cors';
import auth from './helpers/auth';
import Auth from './endpoints/auth';
import GameConfigs from './endpoints/configs';
import GameItems from './endpoints/items';

export default mongo => {
    var app = express(),
        server;

    // Parse body query to JSON
    app.use(bodyParser.json());

    // Allow Cross Domain
    app.use(cors);

    // JWT authorization
    app.use(
        jwt({
            secret: config.secret,
            getToken: auth.getToken
        }).unless({
            path: ['favicon.ico', '/', '/auth/register', '/auth/login']
        })
    );
    app.use(auth.handleUnauthorizedRequest);

    // Configure multer to save files in files directory
    const storage = multer.diskStorage({
        destination: '../files',
        filename(req, file, cb) {
            console.log('Storing file', file);
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
    const upload = multer({ storage });

    // routes
    app.use('/auth', Auth(mongo.collection(config.USER_COLLECTION)));
    app.use(
        '/config',
        GameConfigs(mongo.collection(config.GAME_CONFIGS_COLLECTION))
    );
    app.use('/items', GameItems(mongo));
    app.use('/files', upload.single('file'), function (req, res) {
        console.log('Req', req.file, req.body);
        res.status(200).json({
            file: '/files/' + req.file.filename,
            size: req.file.size
        });
    });
    app.use('/', function (req, res) {
        res.status(200).json({ version: '2.0.0' });
    });

    server = app.listen(process.env.PORT || 8080, function started() {
        console.log('Api Server started on:', server.address());
    });
};
