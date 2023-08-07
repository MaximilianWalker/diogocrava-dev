import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs'
import path from 'path'

const dir = path.resolve('./public', 'inputs');
const files = fs.readdirSync(dir);
const input = fs.readFileSync(files.find((file) => file.includes('gpt.txt')));

export default async function handler(req, res) {

  const configuration = new Configuration({
    apiKey: "<INSERT-API-KEY-HERE>",
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: input },
      { role: "user", content: "Who won the world series in 2020?" },
      { role: "assistant", content: "The Los Angeles Dodgers." },
      { role: "user", content: "Where was it played?" },
    ],
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 1,
  });

  res.status(200).json({ answer: response.data.choices[0].message.content });
}