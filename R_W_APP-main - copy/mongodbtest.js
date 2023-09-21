const { MongoClient } = require('mongodb');

async function main() {
  const url =
    'mongodb+srv://development:WlGzbe3azPX9WJIo@kumeurivercluster0.q1xup.mongodb.net/Kumeu?retryWrites=true&w=majority';

  const client = new MongoClient(url);
  try {
    await client.connect();
    //await listDatabases(client);

    //const mongodb = client.currentUser.mongoClient('url');
    const SelectedDatabase = client.db('Kumeu').collection('BobGraph');
    //const somthing = await plants.findOne({});

    // select * from TaeaTest where date =  Date: 'Sat 24th Jul 2021' and Time like 'pm';
    const result = await SelectedDatabase.findOne({
      Date: 'Mon 2nd Aug 2021',
      Time: /.*pm.*/,
    });

    if (result) {
      console.log(`Found a listing in the collection`);
      console.log(result);
    } else {
      console.log(`No listings found `);
    }

    // var MongoClient = require('mongodb').MongoClient;
    // var url = "mongodb://localhost:27017/";

    // MongoClient.connect(url, function(err, db) {
    //   if (err) throw err;
    //   var dbo = db.db("mydb");
    //   dbo.collection("customers").findOne({}, function(err, result) {
    //     if (err) throw err;
    //     console.log(result.name);
    //     db.close();
    //   });
    // });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log('Databases:');
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}
