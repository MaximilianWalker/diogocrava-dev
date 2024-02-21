import { MongoClient } from 'mongodb';
import { createInterface } from 'readline/promises';
import { config } from 'dotenv';

import schemas from '../schemas/index.mjs';

config({ path: '.env.local' });

const {
    MONGODB_URI,
    MONGODB_DATABASE
} = process.env;

const client = new MongoClient(MONGODB_URI);

const cmd = createInterface({
    input: process.stdin,
    output: process.stdout
});

async function deploy() {
    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(MONGODB_DATABASE);

        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        for (const schema of schemas) {
            if (!collectionNames.includes(schema.name)) {
                await schema.create(db);
                console.log(`Collection created: ${schema.name}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

async function main() {
    try {
        console.log('1. Deploy');

        const option = await cmd.question('Option: ');

        if (option == 1) deploy();
        else console.log('Invalid option!');
    } catch (ex) {
        console.log(ex);
    } finally {
        cmd.close();
    }
}

main();

