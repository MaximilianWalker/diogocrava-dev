export async function GET(request, { params }) {
	if (!params?.name || params.name === "")
		return new Response("Missing or invalid input name!", { status: 400 });

	try {
		const db = await getDatabase();
		const cursor = await db.collection("explorer_sections").sort({ timestamp: -1 }).limit(1);

		if (!(await cursor.hasNext()))
			return new Response("Couldn't find any Sections!", { status: 404 });

		const result = await cursor.toArray();
		return Response.json(result);
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