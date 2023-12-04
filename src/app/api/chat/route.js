import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, streamToResponse } from 'ai';
// import { getDatabase } from '../mongodb';
import { connection } from '../atlasAPI';

export const runtime = 'edge';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
	try {
		// const db = await getDatabase();
		// const cursor = await db.collection("inputs").find({ name: "gpt" }).sort({ timestamp: -1 }).limit(1);
		// const result = await cursor.next();
		// const input = result.value;

		const result = await connection.collection("inputs").find({ name: "gpt" }).sort({ timestamp: -1 }).limit(1).run();

		const input = result[0].value;

		let { messages } = await req.json();

		messages = messages ?? [];

		if (messages.length === 0 || messages[0].role !== 'system') {
			messages.unshift({ role: 'system', content: input });
		}

		const response = await openai.chat.completions.create({
			model: 'gpt-4',
			stream: true,
			messages,
			// max_tokens: 50,
			// n: 1,
			// stop: null,
			// temperature: 1
		})

		const stream = OpenAIStream(response);
		return new StreamingTextResponse(stream);
		// return streamToResponse(stream);
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}