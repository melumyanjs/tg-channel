
import { MongoClient, ObjectId } from 'mongodb';

class MongoDB {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  async connect() {
    this.client = await MongoClient.connect(this.url);
    this.db = this.client.db(this.dbName);
  }

  async disconnect() {
    await this.client.close();
    this.client = null;
    this.db = null;
  }

  async insert(collectionName, document) {
    const collection = this.db.collection(collectionName);
    const result = await collection.insertOne(document);
    return result.insertedId;
  }

  async find(collectionName, query) {
    const collection = this.db.collection(collectionName);
    const result = await collection.find(query).toArray();
    return result;
  }
  
  async update(collectionName, query, update) {
    const collection = this.db.collection(collectionName);
    const result = await collection.updateMany(query, update);
    return result.modifiedCount;
  }

  async remove(collectionName, query) {
    const collection = this.db.collection(collectionName);
    const result = await collection.deleteMany(query);
    return result.deletedCount;
  }

  async aggregate(collectionName, pipeline){
    const collection = this.db.collection(collectionName);
    const result = await collection.aggregate(pipeline).toArray();
    return result
  }
}

export default MongoDB;

export function getObjectId(str) {
  var hex = /[0-9A-Fa-f]{6}/g;
  return (hex.test(str))? new ObjectId(str) : ""
}