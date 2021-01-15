import express from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { findUserById, createUser, checkPassword } from '../services/users';

export default function authRoute(userCollection) {
    var router = express.Router();

    router.post('/login', function login(req, res) {
        const body = req.body;
        const { user: username, password } = body;
        if (!username || !password) {
            console.log('Failed to /login', 'No user or password');
            res.status(422).json({
                code: 422,
                message: 'User and password do not match'
            });
        }
        console.log('Checking credentials', username, password);
        findUserById(userCollection, username)
            .then(user => checkPassword(password, user))
            .then(user => {
                let token = jwt.sign(user, config.secret);
                res.status(200).json({ token: token });
            })
            .catch(err => {
                console.log('Failed to /login', err);
                res.status(err.code || 500).json(err);
            });
    });

    router.post('/register', function login(req, res) {
        const body = req.body;
        const { user: username, password } = body;
        if (!username || !password) {
            console.log('Failed to /register', 'No user or password');
            res.status(422).json({
                code: 422,
                message: 'User and password can not be empty'
            });
        }
        console.log('Registering user', username, password);
        createUser(userCollection, username, password, username)
            .then(user => {
                let token = jwt.sign(user, config.secret);
                res.status(200).json({ token: token });
            })
            .catch(err => {
                console.log('Failed to /register', err);
                res.status(err.code || 500).json(err);
            });
    });

    return router;
}
