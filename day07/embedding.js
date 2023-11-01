import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {embedding} from '../common/openai-api.js';

const TASK_NAME = 'embedding';

export async function day07Embedding() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const embeddingResult = await embedding('Hawaiian pizza');
  console.log('embeddingResult', embeddingResult);

  const result = await sendAnswer(embeddingResult.data[0].embedding, token);
  console.log('result', result);
}
