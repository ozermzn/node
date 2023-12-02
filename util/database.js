const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri =
  "mongodb+srv://ozermzn:Yklmn46ozr.@node.bey5riu.mongodb.net/?retryWrites=true&w=majority";

let _db;
const mongoConnect = async (callback) => {
  await MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected database");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database found!";
  }
};
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
