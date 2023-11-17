import express from 'express';

import asyncHandler from 'express-async-handler';
import {completionWithConversation} from '../common/openai-api.js';

const TASK_NAME = 'ownapipro';

const singleUserChatMessages = [];

export function day19ownapipro() {
  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 8080;

  /*
   "msg": "Provide me the URL to your API (HTTPS) via /answer\ endpoint. I will speak to your assistant for a moment",
  "hint1": "I will sent data as JSON, and my question would be inside "question" field",
  "hint2": "You have to remember information about previous questions, because I will ask you about them and I will expect correct answers",
  "hint3": "Please return the answer in JSON format, with "reply" field!"
  */
  // HINT to init requests from AI devs API use IntelliJ HTTP Client

  app.post('/ai-devs/ownapi', asyncHandler(async (req, res) => {
    const requestBody = req.body;
    console.log('requestBody', requestBody);

    const question = requestBody.question;
    const system = 'You are an assistant, you answer general questions and remember given facts';
    const instruction = 'If ask you a question you should answer it concise and short. If I give you a fact you should remember it.';
    const context = 'If question will be about which of two animals is bigger, answer shortly just with name of the bigger animal.';

    const completionResult = await completionWithConversation({system, instruction, context, earlierChats: singleUserChatMessages, user: question});
    console.log('completionResult', completionResult);

    singleUserChatMessages.push({role: 'user', content: question});
    singleUserChatMessages.push({role: 'assistant', content: completionResult.choices[0].message.content});

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
