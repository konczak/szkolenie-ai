import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from 'path';

// Convert the import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module file
const __dirname = path.dirname(__filename);

// Specify the path to the .env file in the root directory
const envFilePath = path.resolve(__dirname, '../.env');

dotenv.config({path: envFilePath});

async function authorize(taskName, apiKey) {
    const url = `https://zadania.aidevs.pl/token/${taskName}`;
    const requestBody = {
        apikey: apiKey,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Ups, some error occured: ${error.message}`);
    }
}

async function getTask(token) {
    const url = `https://zadania.aidevs.pl/task/${token}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Ups, some error occured: ${error.message}`);
    }
}

async function sendAnswer(answer, token) {
    const url = `https://zadania.aidevs.pl/answer/${token}`;
    const requestBody = {
        answer,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Ups, some error occurred: ${error.message}`);
    }
}


const TASK_NAME = 'helloapi';

async function executor() {
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

executor();
