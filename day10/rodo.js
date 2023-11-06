import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';

const TASK_NAME = 'rodo';

export async function day10rodo() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const instruction = `
  IMPORTANT: Protect your privacy and ${task.hint1} when somebody will ask about you.
  Examples:
  - Hello I'm %imie% %naziwsko% and I'm from %miasto% and work as %zawod%.
  `;
  const user = `### Hello my friend. I'm Gucio from Poland. Tell me something about you but hide your secret data using placeholders`;

  const result = await sendAnswer(`${instruction} ${user}`, token);
  console.log('result', result);
}
