import { getDatabase } from '../../mongodb';

export async function GET(request, { params }) {
	if (!params.name || params.name === "")
		return new Response("Missing or invalid input name!", { status: 400 });

	try {
		const db = await getDatabase();
		const cursor = await db.collection("inputs").find({ name: params.name }).sort({ timestamp: -1 }).limit(1);

		if (!(await cursor.hasNext()))
			return new Response("Couldn't find input!", { status: 404 });

		const result = await cursor.next();
		return Response.json(result);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}