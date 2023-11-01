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

export async function completion({system, context, instruction, user}) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const messages = [];

  if (system) {
    messages.push({role: 'system', content: system});
  }

  if (context) {
    messages.push({role: 'system', content: context});
  }

  if (instruction) {
    messages.push({role: 'system', content: instruction});
  }

  messages.push({role: 'user', content: user});

  return openai.chat.completions.create({
    messages,
    temperature: 0.5,
    model: 'gpt-3.5-turbo',
  });
}

export async function embedding(input) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  return openai.embeddings.create({input, model: 'text-embedding-ada-002'})
}


