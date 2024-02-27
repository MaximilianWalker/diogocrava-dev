import { getDatabase } from '@/app/api/mongodb';
import { generateSystemTree } from "@/utils/systemUtils";

export async function GET(request, { params: { sha } }) {
	try {
		const githubResponse = await fetch(`https://api.github.com/repos/username/repository/git/blobs/${sha}`, {
			headers: {
				// 'Authorization': `Bearer ${githubToken}`,
				'Accept': 'application/vnd.github.v3.raw',
			},
		});

		if (!githubResponse.ok)
			throw new Error('Failed to fetch the GitHub blob');

		// Since you're in an Edge environment, directly using Buffer for Base64 decoding might not be supported.
		// Fetch the content as an ArrayBuffer and serve it directly if it's binary.
		// This example assumes binary content; for text, you might not need decoding.
		const contentArrayBuffer = await githubResponse.arrayBuffer();

		// Determine the MIME type. You might need to adjust this based on the file type you're expecting.
		// For more dynamic MIME type handling, you could use the file's extension or other characteristics.
		const mimeType = 'application/octet-stream'; // Default MIME type, adjust based on your file types

		return new Response(contentArrayBuffer, {
			headers: {
				'Content-Type': mimeType,
			},
		});
	} catch (error) {
		console.error('Error fetching blob from GitHub:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}
