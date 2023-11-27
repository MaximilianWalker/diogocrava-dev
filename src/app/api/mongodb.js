import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const database = 'main';
const options = {};

if (!uri) throw new Error('Failed to load Mongo URI!');

export async function getConnection() {
    const client = new MongoClient(uri, options);
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClient)
            global._mongoClient = await client.connect();
        return global._mongoClient;
    } else {
        return await client.connect();
    }
}

export async function getDatabase() {
    const connection = await getConnection();
    return connection.db(database);
}