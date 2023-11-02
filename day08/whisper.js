import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {transcribe} from '../common/openai-api.js';

const TASK_NAME = 'whisper';

export async function day08whisper() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const audioUrl = 'https://zadania.aidevs.pl/data/mateusz.mp3';
  const transcribeResult = await transcribe(audioUrl);
  console.log('transcribeResult', transcribeResult);

  const result = await sendAnswer(transcribeResult.text, token);
  console.log('result', result);
}
