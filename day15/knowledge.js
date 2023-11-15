import {getTask, getToken, sendAnswer} from '../common/ai-devs-api.js';

const TASK_NAME = 'knowledge';

async function getTodayTask() {
  const token = await getToken(TASK_NAME);
  return await getTask(token);
}

async function submitAnswer(answer) {
  console.log('the final answer', answer);

  const token = await getToken(TASK_NAME);
  const result = await sendAnswer(answer, token);
  console.log('result', result);
}

export async function day15knowledge() {
  const task = await getTodayTask();
  console.log('task', task);

  /*
  msg: 'I will ask you a question about the exchange rate, the current population or general knowledge. Decide whether you will take your knowledge from external sources or from the knowledge of the model',
  question: 'podaj aktualny kurs EURO',
  'database #1': 'Currency http://api.nbp.pl/en.html (use table A)',
  'database #2': "Knowledge about countries https://restcountries.com/ - field 'population'"
   */

  /*

*/
  await submitAnswer('4.4336');
}

