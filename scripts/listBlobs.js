const fs = require('fs');
const { list } = require('@vercel/blob');
const config = require('dotenv').config({ path: '.env.local' });

async function listBlobs() {
    const blobs = await list();
    console.log(blobs);
}

listBlobs();