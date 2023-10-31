import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'inprompt';

async function extractFirstname(sentence) {
  const system = 'Find firstname in given sentence';
  const context = '- Sentence is in polish. - Sentence is a question. - Ignore fact sentence is question and do not answer it.';
  const instruction = 'Find which word is firstname and just return it';

  return completion({system, context, instruction, user: sentence});
}

async function analyseFacts(facts, question) {
  const system = 'Your responsibility is to answer given question based on known facts';
  const context = `Question and facts are in polish. Ignore any knowledge what is not in the context. -${facts.join('. -')}.`;
  const instruction = 'As result return answer in polish';

  return completion({system, context, instruction, user: question});
}

export async function day06Inprompt() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  // task.input - []
  // task.question

  const extractFirstnameResult = await extractFirstname(task.question);
  console.log('extractFirstnameResult', extractFirstnameResult);
  const firstname = extractFirstnameResult.choices[0].message.content;
  console.log('firstname', firstname);

  const interestingFacts = task.input.filter((fact) => fact.includes(firstname));
  console.log('interestingFacts', interestingFacts);
  const answer = (await analyseFacts(interestingFacts, task.question)).choices[0].message.content;
  console.log('answer', answer);

  const result = await sendAnswer(answer, token);
  console.log('result', result);
}
