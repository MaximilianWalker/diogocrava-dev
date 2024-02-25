import { getDatabase } from '@/app/api/mongodb';

export async function GET(request, { params }) {
	try {
		const db = await getDatabase();
		const cursor = await db.collection("explorer_sections").find().sort({ order: 1 });
		const result = await cursor.toArray();

		if (result.length === 0)
			return new Response("Couldn't find any Sections!", { status: 404 });

		return Response.json(result);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}