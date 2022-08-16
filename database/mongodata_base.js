const mongodb = require('mongodb');
const config = require('../config/config');

let connectionUrl;
let mongoConnection;
const { mongodb: { host, port, database } } = config;

class MongodbService{
    static async init(){
        connectionUrl = `mongodb://${host}:${port}/${database}`;
        //#1
       /* mongodb.MongoClient.connect(connectionUrl , (err, db) =>{
            console.log('1     -  connected to mongo db. *******************\n', db);
            mongoConnection = db;
            return mongoConnection;
        });*/

        await new Promise(resolve => {
            mongodb.MongoClient.connect(connectionUrl , (err, result) =>{
                console.log("Mongo Db connect", result);
                mongoConnection = result;
                resolve();
            });
        });
        //#2
       // mongoConnection = mongodb.MongoClient.connect(connectionUrl).;
      //  console.log('connected to mongo connection.', mongoConnection);
       return mongoConnection;
    }

    static closeConnection(){
        mongodb.MongoClient.close();
    }
}

module.exports = MongodbService;