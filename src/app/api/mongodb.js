import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const database = process.env.MONGODB_DATABASE;
const options = {};

if (!uri) throw new Error('Failed to load Mongo URI!');

export async function getConnection() {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClient) {
            const client = new MongoClient(uri, options);
            global._mongoClient = await client.connect();
        }
        return global._mongoClient;
    } else {
        const client = new MongoClient(uri, options);
        return await client.connect();
    }
}

export async function getDatabase() {
    const connection = await getConnection();
    return connection.db(database);
}