const config = require('./config/config');
const { start } = require('npm/lib/utils/metrics');
const PGService = require('./database/pgdata_base');
const MongodbService = require('./database/mongodata_base');

//start();

(async () =>{
    let pgclient;
    let mongodb;
    let result;
    let tenantIds;
    let query;
    let pgMongoData;
    try{ 
        tenantIds = config.tenant;
        pgclient =  PGService.init();
        mongodb = await MongodbService.init();
        await pgclient.connect();

        moveDefaultPgData(pgclient, mongodb);
        //5.#             #               # accounts data
        if(tenantIds && tenantIds[0] == 'all'){
            query = `SELECT * FROM accounts`;
        }else{
            query = `SELECT * FROM accounts where tenant_id IN (${tenantIds})`;
        }
        await new Promise(resolve => {
            pgclient.query(query ,(err, results) => {
                pgMongoData = prepareCollectionData(results.rows);
                mongodb.db('tenant').collection('accounts').insertMany(pgMongoData);
                //MongodbService.closeConnection();
                resolve();
            });
    });

        await pgclient.end();
        return;
    }catch(error){
        console.log("error connecting to postgres DB", error);
    }

})();


 moveDefaultPgData = async(pgclient, mongodb) =>{
    let pgMongoData;
  //1.#             #               # application data
 /* query = 'SELECT * FROM application';
  await new Promise(resolve => {
      pgclient.query(query ,(err, results) => {
          pgMongoData = prepareCollectionData(results.rows, 'application');
          mongodb.db('tenant').collection('application').insertMany(pgMongoData);
          resolve();
      });
  });

  //2.#             #               # ssoconfig data
  query = 'SELECT * FROM ssoconfig';
  await new Promise(resolve => {
      pgclient.query(query ,(err, results) => {
          pgMongoData = prepareCollectionData(results.rows, 'ssoconfig');
          mongodb.db('tenant').collection('ssoconfig').insertMany(pgMongoData);
          resolve();
      });
  });

  //3.#             #               # cmxuser data
  query = 'SELECT * FROM cmxuser';
  await new Promise(resolve => {
      pgclient.query(query ,(err, results) => {
          pgMongoData = prepareCollectionData(results.rows, 'cmxuser');
          mongodb.db('tenant').collection('cmxuser').insertMany(pgMongoData);
          resolve();
      });
  });*/
  //4.#             #               # login_history
  query = 'SELECT * FROM login_history';
  await new Promise(resolve => {
      pgclient.query(query ,(err, results) => {
          pgMongoData = prepareCollectionData(results.rows, 'login_history');
          mongodb.db('tenant').collection('login_history').insertMany(pgMongoData);
          resolve();
      });
  });
}

prepareCollectionData = (pgResult, collection) =>{ 
    let data = [];
    if(collection == 'accounts'){
        pgResult.forEach(row => {
            row._id = row.tenant_id;
            data.push(row);
        });
    }else{
        pgResult.forEach(row => {
            row._id = row.id;
            data.push(row);
        });
        pgResult.map(function(result) {return {...result, _id:result.id}});
    }
    console.log(`data prepared **  ${collection} is :`,data);
    return data;
};
