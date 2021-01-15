import 'babel-polyfill';
import MongoDB from 'mongodb';

import App from './app';

console.log('Mongo', process.env.MONGODB_URL);
const mongourl = process.env.MONGODB_URL
    ? `${process.env.MONGODB_URL}:27017`
    : 'mongodb://127.0.0.1:27017';
const MONGODB_URL = mongourl + '/gameserver';
console.log('Waiting MongoDB...');
setTimeout(() => {
    Promise.all([MongoDB.MongoClient.connect(MONGODB_URL)])
        .then(([mongoClient]) => {
            console.log('Mongo started OK');
            App(mongoClient);
        })
        .catch(err => {
            console.log('Game Server can not run:', err);
        });
}, 5000);
