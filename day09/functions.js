import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';

const TASK_NAME = 'functions';

function createAddUserFunctionDefinition() {
  return {
    name: 'addUser',
    description: 'Add users to the db',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Firstname of the user',
        },
        surname: {
          type: 'string',
          description: 'Surname of the user',
        },
        year: {
          type: 'integer',
          description: 'Year of born of the user',
        },
      },
      required: ['name', 'surname', 'year'],
    },
  };
}

export async function day09functions() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;

  const task = await getTask(token);
  console.log('task', task);

  const addUserFunctionDefinition = createAddUserFunctionDefinition();

  const result = await sendAnswer(addUserFunctionDefinition, token);
  console.log('result', result);
}
