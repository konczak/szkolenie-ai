import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {completionWithConversation} from '../common/openai-api.js';

const TASK_NAME = 'whoami';

async function getToken() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;
  return token;
}

async function getTip() {
  const token = await getToken();
  return await getTask(token);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function day12whoami() {
  const system = 'You are assistant responsible for find out person lastname based on provided hints';
  const instruction = 'If you do not know answer return in response exactly "do not know". If you know respond with just lastname of the person';
  const maxTokens = 20;

  const earlierChats = [];
  let guessed = false;
  let tries = 10;
  let answer = '';
  do {
    const tip = await getTip();
    console.log('tip', tip);
    const user = tip.hint;

    const completionResult = await completionWithConversation({system, instruction, earlierChats, user, maxTokens});
    console.log('completionResult', completionResult);
    if (completionResult.choices[0].message.content !== 'do not know') {
      guessed = true;
      answer = `${completionResult.choices[0].message.content}`;
      break;
    }
    earlierChats.push({role: 'user', content: user});
    earlierChats.push({role: 'assistant', content: completionResult.choices[0].message.content});
    if (tries-- <= 0) {
      throw Error('ups AI didnt guess in 10 tries');
    }
    if (tries % 3 === 0) {
      await sleep(3500);
    }
  } while (!guessed);

  const token = await getToken();
  const result = await sendAnswer(answer, token);
  console.log('result', result);
}

