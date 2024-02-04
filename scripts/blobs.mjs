import { readFileSync } from 'fs';
import { createInterface } from 'readline/promises';
import { list, put, copy, del } from '@vercel/blob';
import { config } from 'dotenv';

config({ path: '.env.local' });

const { BLOB_READ_WRITE_TOKEN } = process.env;

const cmd = createInterface({
    input: process.stdin,
    output: process.stdout
});

async function listBlobs() {
    const result = await list();
    console.log(result.blobs);
}

async function downloadBlob() {
    
}

async function uploadBlob() {
    const filePath = await cmd.question('Path: ');

    const file = {
        name: filePath.split('/').pop(),
        content: readFileSync(filePath)
    };

    try {
        const response = await put(file.name, file.content, {
            access: 'public',
            addRandomSuffix: false,
            token: BLOB_READ_WRITE_TOKEN
        });
        console.log(response);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function deleteBlob() {
    const { blobs } = await list();
    const blobList = blobs.map((blob, index) => `${index + 1}. ${blob.url}`).join('\n');
    console.log(blobList);

    let index = null;
    while(typeof index !== 'number'){
        try{
            index = parseInt(await cmd.question('Index: '));
            if(index < 0 || index > blobList.length)
                throw new Error();
        } catch(err){
            console.log('Invalid index!');
        }
    }

    del(blobs[index - 1].url);
}

async function main() {
    try {
        let option;
        while (option != 5) {
            console.log('Select one of the following options:');
            console.log('   1. List Blobs');
            console.log('   2. Download Blob');
            console.log('   3. Upload Blob');
            console.log('   4. Delete Blob');
            console.log('   5. Exit');

            option = await cmd.question('Option: ');

            if (option == 1) await listBlobs();
            else if (option == 2) await downloadBlob();
            else if (option == 3) await uploadBlob();
            else if (option == 4) await deleteBlob();
            else console.log('Invalid option!');
        }
    } catch (ex) {
        console.log(ex);
    } finally {
        cmd.close();
    }
}

main();