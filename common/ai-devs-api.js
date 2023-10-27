
export async function authorize(taskName, apiKey) {
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
        throw new Error(`Ups, some error occurred during authorize: ${error.message}`);
    }
}

export async function getTask(token) {
    const url = `https://zadania.aidevs.pl/task/${token}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Ups, some error occurred during getTask: ${error.message}`);
    }
}

export async function sendAnswer(answer, token) {
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
        throw new Error(`Ups, some error occurred during sendAnswer: ${error.message}`);
    }
}

