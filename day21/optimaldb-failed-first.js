import fs from 'fs';

import util from 'util';

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

function splitIntoMultipleArrays(anArray) {
  return anArray.reduce((acc, item, index) => {
    if (index % 10 === 0) {
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

  const db = await readDb();
  console.log('db', db.stefan.length, db.stefan);

  const system = 'You are assistant responsible for shortcutting given facts';
  const context = 'Will send to you list of 10 facts about Stefan. Facts are in polish and you rewrite them in polish. Preserve all important facts but try to shorten sentences it as much as possible.';
  const instruction = `### Examples:
  Podczas ostatniej konferencji technologicznej, program który stworzył Stefan wygrał nagrodę za innowacyjność w użyciu JavaScript. => Wygrał nagrodę za innowacyjność w użyciu JavaScript
  Wśród ulubionych gier wideo Stefana królują strategiczne RPGi, gdzie może pokazać swoje umiejętności planowania. => Jwego ulubione gry wideo to strategiczne RPGi
  Miłośnicy fotografii cenią zdjęcia autorstwa Stefana, które ukazują unikalne perspektywy miejskich krajobrazów. => Zdjęcia jego autorstwa ukazują unikalne perspektywy miejskich krajobrazów
  `;

  const multipleFactsArrays = splitIntoMultipleArrays(db.stefan);

  const exchangeFactsArrayIntoShorterOnes = async (factsArray) => {
    console.log('factsArray', factsArray);

    const chatCompletion = await completion({system, context, instruction, user: factsArray.join(' - ')});
    console.log('chatCompletion', chatCompletion);

    const shortFactsString = chatCompletion.choices[0].message.content;
    console.log('shortFactsString', shortFactsString);

    return shortFactsString.split('\n');
  };


  const arraysOfShorterFacts = await Promise.all(multipleFactsArrays.map(exchangeFactsArrayIntoShorterOnes));
  console.log('arraysOfShorterFacts', arraysOfShorterFacts);
  const allShortFacts = arraysOfShorterFacts.reduce((acc, arrayOfFacts) => {
    acc.push(...arrayOfFacts);
    return acc;
  }, []);

  await saveToFile('stefan', allShortFacts);


}
