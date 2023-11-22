import {completion} from '../common/openai-api.js';
import {search} from '../common/serp-api.js';
import express from 'express';

import asyncHandler from 'express-async-handler';

const TASK_NAME = 'google';

async function analyseTask(question) {
  const system = 'Analyse given search request';
  const instruction = `
  Answer using JSON format.
  If you know answer return it.
  If you do not know answer return optimal search engine query which will allow user to find it.
  ###
  Examples:
  - Is Elvis Presley alive? = {"action":"respond","answer":"No, Elvis is dead"}
  - What is a date of opening Warsaw south highway? = {"action":"search","query": "Warsaw south highway opening date"}
  `;
  const completionResult = await completion({system, instruction, user: question});
  console.log('completionResult', completionResult);
  return JSON.parse(completionResult.choices[0].message.content);
}

export function day22google() {
  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 8080;

  /*
  "msg": "Provide me the URL to your API (HTTPS) via \/answer\/ endpoint. I will ask your API a question that requires search engine integration. Your job is to provide me answer to my question",
  "hint1": "Please use SerpAPI or similar service. https:\/\/serpapi.com (free account is enough)",
  "hint2": "Probably I will ask more than one question, so be prepared for that",
  "hint3": "Please return the answer in JSON format, with \"reply\" field!",
  "hint4": "Return as concise an answer as possible"
   */
  // HINT to init requests from AI devs API use IntelliJ HTTP Client

  app.post('/ai-devs/ownapi', asyncHandler(async (req, res) => {
    const requestBody = req.body;
    console.log('requestBody', requestBody);

    const question = requestBody.question;

    const analysisResult = await analyseTask(question);
    console.log('analysisResult', analysisResult);

    let reply;

    if (analysisResult.action === 'search') {
      const searchResult = await search(analysisResult.query);
      console.log('searchResult', searchResult);

      reply = searchResult.organic_results[0].link;
    } else {
      reply = analysisResult.answer;
    }

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
