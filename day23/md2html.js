import {completion} from '../common/openai-api.js';
import express from 'express';

import asyncHandler from 'express-async-handler';

const TASK_NAME = 'md2html';

export function day23md2html() {
  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 8080;

  /*
  "msg": "Provide me the URL to your API (HTTPS) via \/answer\/ endpoint. I will send you some Markdown formated text, and your task is to convert it to HTML. Please fine-tuning model for that.",
  "hint1": "Probably I will ask more than one question, so be prepared for that",
  "hint2": "Please return the answer in JSON format, with \"reply\" field!"
   */
  // HINT to init requests from AI devs API use IntelliJ HTTP Client

  app.post('/ai-devs/ownapi', asyncHandler(async (req, res) => {
    const requestBody = req.body;
    console.log('requestBody', requestBody);

    const question = requestBody.question;

    const system = 'Convert given Markdown to HTML. Remember that _underline_ converts to <u>underline</u>.';
    const completionResult = await completion({system, user: question, model: 'ft:gpt-3.5-turbo-1106:personal::8O0HCMCj'});
    console.log('completionResult', completionResult);
    const reply = completionResult.choices[0].message.content;

    const anAnswer = {
      reply,
    };
    console.log('anAnswer', anAnswer);

    res.json(anAnswer);
  }));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
}
