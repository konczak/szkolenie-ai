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

export async function completion({system, context, instruction, user, maxTokens}) {
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

  let max_tokens = undefined;
  if (maxTokens) {
    max_tokens = maxTokens;
  }

  return openai.chat.completions.create({
    messages,
    temperature: 0.5,
    model: 'gpt-3.5-turbo',
    max_tokens,
  });
}

export async function embedding(input) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  return openai.embeddings.create({input, model: 'text-embedding-ada-002'})
}


export async function transcribe(urlToAudioFile) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  return openai.audio.transcriptions.create({file: await fetch(urlToAudioFile), model: 'whisper-1'});
}
