import fs from 'fs';

import util from 'util';
import {completion} from '../common/openai-api.js';

const TASK_NAME = 'optimaldb';

async function readDb() {
  const readFile = util.promisify(fs.readFile);
  const data = await readFile('./day21/3friends-unoptimized.json', 'utf8');
  return JSON.parse(data);
}

async function saveToFile(filename, shortFacts) {
  const betterFacts = shortFacts.map((fact) => {
      // if last character is . then remove it
      if (fact[fact.length - 1] === '.') {
        return fact.slice(0, -1);
      }
      return fact;
    }
  )
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`./day21/${filename}.json`, JSON.stringify(betterFacts), 'utf8');
}

function splitIntoMultipleArrays(anArray, maxSize) {
  return anArray.reduce((acc, item, index) => {
    if (index % maxSize === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(item);
    return acc;
  }, []);
}

export async function day21optimaldb() {
  /*
  const token = await getToken(TASK_NAME);
  const task = await getTask(token);
  console.log('task', task);
   */

  /*
  msg: 'In a moment you will receive from me a database on three people. It is over 30kb in size. You need to prepare me for an exam in which I will be questioned on this database. Unfortunately, the capacity of my memory is just
9kb. Send me the optimised database',
  database: 'https://zadania.aidevs.pl/data/3friends.json',
  hint: 'I will use GPT-3.5-turbo to answer all test questions'

   */


  const db = (await readDb()).zygfryd;
  console.log('db', db.length, db);

  const name = 'Zygfryd';
  const maxSize = 10;

  const system = 'You are assistant responsible for preparing database about given person';
  const context = `Will send you list of ${maxSize} sentences about ${name}. Sentences are in polish and you store them in polish. Single sentence can contain multiple facts`;
  let knownFacts = `### Known facts:
  Gra na skrzypcach i ukulele. Był gitarzystą.
  Programuje w JavaScript.
  Jest fanem piłki nożnej i klasycznego rocka.
  Posiada rzadki gatunek storczyka, komiksy 'Watchmen' Alana Moore'a, powieść science fiction 'Diuna' Franza Herberta.
  `;
  const instruction = `Write down as short as possible new facts. If facts is same as already known do not repeat it.
  ### Examples:
Podczas ostatniej konferencji technologicznej, program który stworzył Zygfryd wygrał nagrodę za innowacyjność w użyciu JavaScript. => fact[0]: wygrał nagrodę za innowacyjność w użyciu JavaScript
Przyjaciele uważają Zygfryda za mistrza gier VR, w których często bije rekordy i zachwyca swoją zręcznością => fact[0]: w grach VR bije rekordy
Zygfryd, oprócz programowania, interesuje się również hodowlą roślin doniczkowych, a wśród jego zbiorów można znaleźć rzadki gatunek storczyka. => fact[0] = programuje, fact[1] = hoduje rośliny doniczkowe, fact[2] = posiada rzadki gatunek storczyka
  `;

  const multipleFactsArrays = splitIntoMultipleArrays(db, maxSize);
  const pattern = /fact\[\d]: +/g;

  for (let n = 0; n < multipleFactsArrays.length; n++) {
    const facts = multipleFactsArrays[n];
    console.log('facts', facts);

    const chatCompletion = await completion({system, context, instruction, user: knownFacts + '### Sentences' + facts.join('- ')});
    console.log('chatCompletion', chatCompletion);

    const shortFactsString = chatCompletion.choices[0].message.content;
    console.log('\nshortFactsString', shortFactsString);

    const newFacts = shortFactsString.replaceAll(pattern, '');
    console.log('\nnewFacts', newFacts);

    knownFacts += '\n' + newFacts;

    console.log('\nknownFacts', knownFacts);
  }

  const collectedFactsArray = knownFacts.split('\n');
  await saveToFile(name + '1', collectedFactsArray);
}
