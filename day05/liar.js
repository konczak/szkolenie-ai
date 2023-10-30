import {authorize, exchangeQuestionIntoAnswer, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'liar';

export async function day05Liar() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const question = 'What animals produce honey?'

  const questionAnswer = await exchangeQuestionIntoAnswer(question, token);
  console.log('questionAnswer', questionAnswer);

  const system = 'You are responsible for verification whether something is true or not';
  const context = `User will provide a question and answer which maybe is truth or maybe is lie`;
  const instruction = 'Answer only YES or NO uppercase';
  const user = `question: ${question}, answer: ${questionAnswer.answer} `;

  const completionResult = await completion({system, context, instruction, user});
  console.log('completionResult', completionResult);

  const answer = completionResult.choices[0].message.content;
  const result = await sendAnswer(answer, token);
  console.log('result', result);
}
