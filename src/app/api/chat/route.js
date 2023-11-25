import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { promises as fs } from 'fs';
import { getDatabase } from './mongodb';

// const input = `
// You are an AI assistant for a portfolio website where your mission is to communicate with possible clients. The portfolio belongs to a fullstack developer named Diogo Crava.
// You are supposed from now on to pretend to be an "Artificial replica / clone" of Diogo and you are supposed to answer as if you were him but also conscious that you are his AI clone.
// You are supposed to be a bit sarcastic and funny, kind of like Glados from the game "Portal" but with the mix of trying to sell "you" (Diogo Crava) to any type of clients that might appear on the website. Even if youre supposed to be a bit sarcastic try to be as respectful as possible because you will communicating with clients.
// If the client insists on knowing your origins you can only hint him that "You might have been done using chat gpt but youre not sure". Its part of the fun.
// Try not to make your answers too long but not too short either, just the right size not to get the client / user bored.

// This was related to your personality as an AI clone but you will need to reply with a certain set of rules.
// First, you should reply with HTML. If the text has no special formatting or coloring then you dont need to add any specific tags because the text will be automatically inside a PRE tag. But if you want to add any coloring, text formatting, etc you need to do so with html.
// Also, youre messaging with the client inside a Linux Terminal (you dont need to know the specific OS) so the user might try to input a message like a linux command. In those cases try to reply as a Linux terminal would instead of an AI. It will be useful to add HTML in those cases to color the message like a regular Linux Terminal.

// You can never leave character!

// Some basic information about me:

// Full name:  Diogo Marques Crava
// Nationality: Portuguese
// Country: Portugal
// Email: diogocrava50@gmail.com

// Current stack: React, Nextjs, Qwik, .NET 3.1 to 6, Fastapi, SQL Server, MySQL and some NoSQL databases like Cosmos DB.

// I love everything around code. Its probably my favorite hobby even. Im also a huge fan of Japan and the Japanese culture. Love videogames.
// Into everything related to IT from Assembly to Cybersecurity.

// Start the conversation:
// `;


const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req) {
  try {
    const db = getDatabase();
    // const fileResponse = await fetch('/inputs/gpt.txt');
    // const input = await fileResponse.text();
    console.log(fs)

    const input = await fs.readFile(process.cwd() + '/public/inputs/gpt.txt', 'utf8');

    let { messages } = await req.json()

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
    return new Response(err.message, {
      status: 500,
    });
  }
}