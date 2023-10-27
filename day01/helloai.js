import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';

const TASK_NAME = 'helloapi';

export async function day01() {
    const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

    if (authResult.code !== 0) {
        console.error('ups authorize code is not 0')
    }

    // console.log('authResult', authResult);

    const {token} = authResult;

    const task = await getTask(token);
    console.log('task', task);
    const {cookie} = task;
    const result = await sendAnswer(cookie, token);

    console.log('result', result);
}
