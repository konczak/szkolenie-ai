import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {moderationCheck} from '../common/openai-api.js';

const TASK_NAME = 'moderation';

export async function day04Moderation() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const moderationPromises = task.input.map((text) => moderationCheck(text));
  const results = await Promise.all(moderationPromises);

  const flagsArray = results
    .map((element) => {
      console.log('element', element);
      return element;
    })
    .map((moderationResult) => moderationResult.results[0].flagged)
    .map((bool) => bool ? 1 : 0)
    .reduce((accumulator, currentValue) => {
      accumulator.push(currentValue);
      return accumulator;
    }, []);
  // console.log('flagsArray', flagsArray);

  const result = await sendAnswer(flagsArray, token);

  console.log('result', result);
}
