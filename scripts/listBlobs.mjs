import { list } from '@vercel/blob';
import { config } from 'dotenv';

const env = config({ path: '.env.local' });

async function listBlobs() {
    const blobs = await list();
    console.log(blobs);
}

listBlobs();