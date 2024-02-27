import mime from 'mime';
import { getDatabase } from '@/app/api/mongodb';
import { generateSystemTree } from "@/utils/systemUtils";

export async function GET(request, { params }) {
	try {
		const db = await getDatabase();
		const cursor = await db.collection("system").find();
		const treeResponse = await getRepositoryTree();
		const repositoryTree = mapRepositoryTree(treeResponse.tree, 'diogocravaDevId');

		if (!(await cursor.hasNext()))
			return new Response("Couldn't find any folders or files!", { status: 404 });

		const result = await cursor.toArray();
		const system = generateSystemTree([...result, ...repositoryTree]);
		return Response.json(system);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}

// Documentação para obter os dados de um repositorio no Github
// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28


// https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#get-a-tree
async function getRepositoryTree() {
	const apiUrl = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`;
	try {
		const branchResponse = await fetch(`${apiUrl}/branches/${process.env.GITHUB_BRANCH}`, {
			headers: {
				// 'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github+json'
			}
		});

		if (!branchResponse.ok)
			throw new Error('Failed to fetch branch information');

		const branchData = await branchResponse.json();
		const latestCommitSha = branchData.commit.sha;

		const treeResponse = await fetch(`${apiUrl}/git/trees/${latestCommitSha}?recursive=1`, {
			headers: {
				// 'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			}
		});

		if (!treeResponse.ok)
			throw new Error('Failed to fetch tree information');

		return await treeResponse.json();
	} catch (error) {
		console.log("super kek")
		console.error('Error:', error);
		throw error;
	}
}

function mapRepositoryTree(tree, parent) {
	return tree.map(({ sha, path, type }) => ({
		_id: sha,
		name: path.split('/').pop(),
		type: type === 'tree' ? 'folder' : 'file',
		mimetype: type === 'blob' ? mime.getType(path) : undefined,
		parent: tree.find((child) => (
			child.path.split('/').pop() === path.split('/').slice(0, -1).pop()
		))?.sha ?? parent,
		content_url: type === 'blob' ? `/api/system/github-blobs/${sha}` : undefined,
		access: true,
		hidden: false
	}));
}
