import express from 'express';

import asyncHandler from 'express-async-handler';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'ownapi';

export function day18ownapi() {
  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 8080;

  /*
    msg: 'Provide me the URL to your API (HTTPS) via /answer/ endpoint. I will ask your API a general knowledge question',
    hint1: 'I will sent data as JSON, and my question would be inside "question" field',
    hint2: 'Probably I will ask more than one question, so be prepared for that',
    hint3: 'Please return the answer in JSON format, with "reply" field!'
  */
  // HINT to init requests from AI devs API use IntelliJ HTTP Client

  app.post('/ai-devs/ownapi', asyncHandler(async (req, res) => {
    const requestBody = req.body;
    console.log('requestBody', requestBody);

    const question = requestBody.question;
    const system = 'You are an assistant, you should answer general questions';
    const instruction = 'Will ask you a question and you should answer it concise and short.';

    const completionResult = await completion({system, instruction, user: question});
    console.log('completionResult', completionResult);

    const anAnswer = {
      reply: completionResult.choices[0].message.content,
    };
    console.log('anAnswer', anAnswer);
    res.json(anAnswer);
  }));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
}
