import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const database = 'main';
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

if (!uri) throw new Error('Please add your Mongo URI to .env.local');

const client = new MongoClient(uri, options);

export async function getConnection() {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise)
            global._mongoClient = await client.connect();
        return global._mongoClient;
    } else {
        return await client.connect();
    }
}

export async function getDatabase() {
    const connection = getConnection();
    return connection.db(database);
}