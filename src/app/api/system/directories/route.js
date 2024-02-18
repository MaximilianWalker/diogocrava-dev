import { getDatabase } from '@/app/api/mongodb';
import { generateSystemTree } from "@/utils/systemUtils";

export async function GET(request, { params }) {
	try {
		const db = await getDatabase();
		const cursor = await db.collection("system").find();

		if (!(await cursor.hasNext()))
			return new Response("Couldn't find any folders or files!", { status: 404 });

		const result = await cursor.toArray();
		const system = generateSystemTree(result);
		return Response.json(system);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}

// Criar metodo para obter a lista de ficheiros do repositorio

// Documentação para obter os dados de um repositorio no Github
// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28


// Para obter a arvore de ficheiros do repositorio
// https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#get-a-tree