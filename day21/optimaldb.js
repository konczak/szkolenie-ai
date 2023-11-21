import {getTask, getToken, sendAnswer} from '../common/ai-devs-api.js';

import fs from 'fs';

import util from 'util';

const TASK_NAME = 'optimaldb';

async function readDb(filename = '3friends-unoptimized') {
  const readFile = util.promisify(fs.readFile);
  const data = await readFile(`./day21/${filename}.json`, 'utf8');
  return JSON.parse(data);
}

async function saveToFile(filename, shortFacts) {
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`./day21/${filename}.json`, JSON.stringify(shortFacts), 'utf8');
}

async function compactParticularDbsIntoOne() {
  const zygfrydDb = (await readDb('zygfryd-optimized-by-v4'));
  const stefanDb = (await readDb('stefan-optimized-by-v4'));
  const aniaDb = (await readDb('ania-optimized-by-v4'));
  const optimizedDb = {
    zygfryd: zygfrydDb,
    stefanDb: stefanDb,
    ania: aniaDb,
  }
  console.log('optimizedDb', optimizedDb);

  await saveToFile('full-optimized', optimizedDb);
}

export async function day21optimaldb() {
  // to finally solve this task first have taken content of the original db and split it into 3 separate files by person
  // every JSON have put into OpenAI playground and asked GPT-4-1106-preview model to shorten its content about 50%
  // as still it has limit of  4096 output tokens split sound as a good idea
  // would it be possible to achieve the same with code?
  //  yes! but as it already took me few hours with failed tries then above solution suggested by other training participant was a good a quick idea to try out

  // await compactParticularDbsIntoOne();

  const optimizedDb = await readDb('full-optimized');

  const token = await getToken(TASK_NAME);
  const task = await getTask(token);
  console.log('task', task);

  /*
  msg: 'In a moment you will receive from me a database on three people. It is over 30kb in size. You need to prepare me for an exam in which I will be questioned on this database. Unfortunately, the capacity of my memory is just
9kb. Send me the optimised database',
  database: 'https://zadania.aidevs.pl/data/3friends.json',
  hint: 'I will use GPT-3.5-turbo to answer all test questions'
   */

  const result = await sendAnswer(JSON.stringify(optimizedDb), token);
  console.log('result', result);
}
