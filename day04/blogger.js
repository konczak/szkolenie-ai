import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'blogger';

export async function day04Blog() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const system = `
  You are blog author.
  You receive list of chapters and generate text content for each of them.
  `;
  const context = `
  Rules:
  - provide facts,
  - provide details,
  - text has to be in polish language,
  - chapter text length has to be at least 200 characters,
  `;
  const instruction = `
  Answer provide in JSON format with list of chapter texts separated by comma.
  Example:
  ["text of chapter 1","text of chapter 2","text of chapter 3"]
  `;

  const blogResult = await completion({system, context, instruction, user: task.blog.join(', ')});
  console.log('blogResult', blogResult);

  const answer = JSON.parse(blogResult.choices[0].message.content);
  console.log('answer', answer);
  const result = await sendAnswer(answer, token);
  console.log('result', result);
}
