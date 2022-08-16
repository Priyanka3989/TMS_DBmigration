const { Client } = require('pg');
const config = require('../config/config');

let client;
class PGService {
    static init() {
        const { postgres: { host, port, database, user, password } } = config;
        const dbConfig = {
            host: host,
            database: database,
            user: user,
            password: password,
            port: port,
            idleTimeoutMillis: 30000,
          };
          client = new Client(dbConfig);
          return client;
    }

    static getConnection() {
        return client.connect();
      }
}

module.exports = PGService;