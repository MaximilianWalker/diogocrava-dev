import { getDatabase } from '@/app/api/mongodb';

export async function GET(request, { params }) {
	const { searchParams } = new URL(request.url);
	const ids = searchParams.getAll('id');

	if (!ids)
		return new Response("Missing or invalid input names!", { status: 400 });

	try {
		const db = await getDatabase();
		const cursor = await db.collection("inputs").find({ name: { $in: ids } }).sort({ timestamp: -1 });
		const result = await cursor.toArray();

		if (result.length < ids.length)
		    return new Response("Some inputs were not found!", { status: 400 });

		return Response.json(result);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}