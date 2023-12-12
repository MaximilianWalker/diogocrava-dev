import { readFileSync } from 'fs';
import { createInterface } from 'readline/promises';
import { list, put } from '@vercel/blob';
import { config } from 'dotenv';

const env = config({ path: '.env.local' });

const cmd = createInterface({
    input: process.stdin,
    output: process.stdout
});

async function listBlobs() {
    const blobs = await list();
    console.log(blobs);
}

async function downloadBlob() {
    const filePath = await cmd.question('Path: ');

    const file = {
        name: filePath.split('/').pop(),
        content: readFileSync(filePath)
    };

    try {
        const response = await put(file.name, file.content, {
            access: 'public',
            addRandomSuffix: false,
            token: env.BLOB_READ_WRITE_TOKEN
        });
        console.log(response);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
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
            token: env.BLOB_READ_WRITE_TOKEN
        });
        console.log(response);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function deleteBlob() {
    const filePath = await cmd.question('Path: ');

    const file = {
        name: filePath.split('/').pop(),
        content: readFileSync(filePath)
    };

    try {
        const response = await put(file.name, file.content, {
            access: 'public',
            addRandomSuffix: false,
            token: env.BLOB_READ_WRITE_TOKEN
        });
        console.log(response);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function main() {
    try {
        let option;
        while(option != 5){
            console.log('Select one of the following options:');
            console.log('   1. List Blobs');
            console.log('   2. Download Blob');
            console.log('   3. Upload Blob');
            console.log('   4. Delete Blob');
            console.log('   5. Exit');

            option = await cmd.question('Option: ');

            if(option == 1) await listBlobs();
            else if(option == 2) await downloadBlob();
            else if(option == 3) await uploadBlob();
            else if(option == 4) await deleteBlob();
            else {
                console.log('Invalid option!')
            }
        }
    } catch (ex) {
        console.log(ex);
    } finally {
        cmd.close();
    }
}

main();