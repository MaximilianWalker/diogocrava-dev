import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getDatabase } from '../mongodb';

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req) {
	try {
		console.log("1")
		const db = await getDatabase();
		console.log("2")
		const cursor = await db.collection("inputs").find({ name: "gpt" }).sort({ timestamp: -1 }).limit(1);
		console.log("3")
		const result = await cursor.next();
		console.log("4")
		const input = result.value;
		console.log(input)

		let { messages } = await req.json();

		messages = messages ?? [];

		if (messages.length === 0 || messages[0].role !== 'system') {
			messages.unshift({ role: 'system', content: input });
		}

		const response = await openai.createChatCompletion({
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
	} catch (err) {
		console.log(err);
		return new Response(err.message, { status: 500 });
	}
}