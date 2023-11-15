import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'tools';

async function getToken() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;
  return token;
}

async function analyseTask(question) {
  const system = 'Analyse given sentence meaning something to do, do not answer it, extract details what about task is';
  const instruction = `
  Answer using JSON format.
  Return sentence classification: ToDo/Calendar/Other.
  Return description what should be done.
  Always use YYYY-MM-DD format for dates.
  ###
  Examples:
  - Przypomnij mi, że mam kupić mleko = {"tool":"ToDo","desc":"Kup mleko" }
  - Jutro mam spotkanie z Marianem = {"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2023-11-15"}
  `;
  const completionResult = await completion({system, instruction, user: `Remember do not answer sentence: ${question}`});
  console.log('completionResult', completionResult);
  return JSON.parse(completionResult.choices[0].message.content);
}

export async function day16tools() {
  const token = await getToken();
  const task = await getTask(token);
  console.log('task', task);

  const question = task.question;
  /*
    msg: 'Decide whether the task should be added to the ToDo list or to the calendar (if time is provided) and return the corresponding JSON',
  hint: 'always use YYYY-MM-DD format for dates',
  'example for ToDo': 'Przypomnij mi, że mam kupić mleko = {"tool":"ToDo","desc":"Kup mleko" }',
  'example for Calendar': 'Jutro mam spotkanie z Marianem = {"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2023-11-15"}',
  question: 'Przypomnij mi, abym zapisał się na AI Devs 3.0'
   */

  const processed = await analyseTask(question);
  console.log('processed', processed);

  console.log('q vs a', question, processed);

  const result = await sendAnswer(processed, token);
  console.log('result', result);
}
