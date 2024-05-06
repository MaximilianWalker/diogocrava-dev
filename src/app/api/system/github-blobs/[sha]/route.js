import { getDatabase } from '@/app/api/mongodb';
import { generateSystemTree } from "@/utils/systemUtils";

export async function GET(request, { params: { sha } }) {
	try {
		const githubResponse = await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/git/blobs/${sha}`, {
			headers: {
				// 'Authorization': `Bearer ${githubToken}`,
				'Accept': 'application/vnd.github.raw+json',
			},
		});

		if (!githubResponse.ok)
			throw new Error('Failed to fetch the GitHub blob');

		// Get the raw body and MIME type from the GitHub response
        const rawData = await githubResponse.blob(); // Use blob() to handle binary data if necessary
        const contentType = githubResponse.headers.get('Content-Type'); // Extract Content-Type from GitHub response

        // Return the raw data with the same MIME type
        return new Response(rawData, {
            status: 200, // HTTP status code 200 for a successful response
            headers: {
                'Content-Type': contentType, // Set Content-Type header to the MIME type received from GitHub
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
