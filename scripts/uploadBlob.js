const fs = require('fs');
const { put } = require('@vercel/blob');
const config = require('dotenv').config({ path: '.env.local' });

const filePath = process.argv[2];

if (!filePath) {
    console.error('No file path provided.');
    process.exit(1);
}

const file = {
    name: filePath.split('/').pop(),
    content: fs.readFileSync(filePath)
};

async function uploadFile() {
    try {
        const response = await put(file.name, file.content, {
            access: 'public',
            addRandomSuffix: false,
            token: config.BLOB_READ_WRITE_TOKEN
        });
        console.log(response);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

uploadFile();