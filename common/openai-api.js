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

export async function completion({system, context, instruction, user, maxTokens, model = 'gpt-3.5-turbo'}) {
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
    model,
    max_tokens,
  });
}

export async function imageAnalysis({user, imageUrl, maxTokens}) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const messages = [];

  messages.push({
    role: 'user', content: [
      {type: 'text', text: user},
      {
        type: 'image_url',
        image_url: {
          'url': imageUrl,
        },
      },
    ]
  });

  let max_tokens = undefined;
  if (maxTokens) {
    max_tokens = maxTokens;
  }

  return openai.chat.completions.create({
    messages,
    temperature: 0.5,
    model: 'gpt-4-vision-preview',
    max_tokens,
  });
}

export async function completionWithConversation({system, context, instruction, earlierChats, user, maxTokens}) {
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

  earlierChats.forEach((earlierChat) => messages.push({role: earlierChat.role, content: earlierChat.content}));

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
