import {authorize, getTask, sendAnswerWithRetries, testAnswerAgainstEcho} from '../common/ai-devs-api.js';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'scraper';

async function getToken() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;
  return token;
}

export async function day11scraper() {
  let token = await getToken();

  const task = await getTask(token);
  console.log('task', task);

  const instruction = task.msg;
  const articleUrl = task.input;
  const user = task.question;
  const maxTokens = 200;

  const articleResponse = await fetch(articleUrl, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0'}});
  const article = await articleResponse.text();
  console.log('article', article);
  const completionResult = await completion({instruction, context: `article: ${article}`, user, maxTokens});
  console.log('completionResult', completionResult);

  const answer = `${completionResult.choices[0].message.content}`;

  const echoResult = await testAnswerAgainstEcho(answer);
  console.log('echoResult', echoResult);

  // refresh token as in most cases is expired
  token = await getToken();

  const maxRetries = 3;
  const result = await sendAnswerWithRetries(answer, token, maxRetries);
  console.log('result', result);
}

