import OpenAI from 'openai';

export async function moderationCheck(input) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  return openai.moderations.create({
    input,
    // model: 'text-moderation-stable',
  });
}
