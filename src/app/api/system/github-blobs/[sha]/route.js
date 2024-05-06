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

		const rawData = await githubResponse.blob();
		const contentType = githubResponse.headers.get('Content-Type');

		return new Response(rawData, {
			status: 200,
			headers: {
				'Content-Type': contentType,
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
