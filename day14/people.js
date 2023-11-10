import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {completion, embedding} from '../common/openai-api.js';
import {v4 as uuidv4} from 'uuid';
import {createCollection, findOne, getCollectionInfo, insertInto, isCollectionIndexed} from '../common/qdrant-db.js';


const TASK_NAME = 'people';
const COLLECTION_NAME = 'szkolenia_day14people';

async function getToken() {
  const authResult = await authorize(TASK_NAME, process.env.AI_DEVS_API_KEY);

  if (authResult.code !== 0) {
    console.error('ups authorize code is not 0')
  }

  const {token} = authResult;
  return token;
}

async function getTodayTask() {
  const token = await getToken();
  return await getTask(token);
}

async function insertDocuments(fileContent) {
  /*
  fileContent is array of objects:
  imie, nazwisko, wiek, o_mnie, ulubiona_postac_z_kapitana_bomby, ulubiony_serial, ulubiony_film, ulubiony_kolor
 */
  const myDocuments = fileContent.map((aiDevsDoc) => {
    const doc = new MyDocument();
    doc.metadata.collection = COLLECTION_NAME;
    doc.metadata.imie = aiDevsDoc.imie;
    doc.metadata.nazwisko = aiDevsDoc.nazwisko;
    // doc.metadata.wiek = aiDevsDoc.wiek;
    // doc.metadata.ulubiona_postac_z_kapitana_bomby = aiDevsDoc.ulubiona_postac_z_kapitana_bomby;
    // doc.metadata.ulubiony_serial = aiDevsDoc.ulubiony_serial;
    // doc.metadata.ulubiony_film = aiDevsDoc.ulubiony_film;
    doc.metadata.ulubiony_kolor = aiDevsDoc.ulubiony_kolor;
    doc.metadata.o_mnie = aiDevsDoc.o_mnie;
    doc.pageContent = aiDevsDoc.o_mnie;
    return doc;
  });

  // Generate embeddings
  const points = [];
  for (let n = 0; n < myDocuments.length; n++) {
    // for (let n = 600; n < 600; n++) {
    const myDocument = myDocuments[n];
    const embeddingResult = await embedding(myDocument.pageContent);
    console.log('myDocument.pageContent vs embeddingResult', myDocument.pageContent, embeddingResult);
    const vector = embeddingResult.data[0].embedding;
    points.push({
      id: myDocument.id,
      payload: myDocument.metadata,
      vector,
    });
    console.log(`converted to embeddings ${n} of ${myDocuments.length} documents`);
  }

  await insertInto(COLLECTION_NAME, points);
}

class MyDocument {
  constructor() {
    this.id = uuidv4();
    this.metadata = {};
    this.pageContent = '';
  }
}

async function initCollectionIfRequired(collectionName) {
  const indexed = await isCollectionIndexed(collectionName);
  console.log('indexed', indexed);
  // Create collection if not exists
  if (!indexed) {
    await createCollection(collectionName);
  }
}

async function analyseQuestion(question) {
  const system = 'Analyse given question, do not answer it, extract details what about question is';
  const instruction = `
  Answer using JSON format.
  Return question category: residence/color/food.
  Return person info like firstname, lastname.
  ###
  Examples:
  - {"category": "residence", "firstname": "Krystyna", "lastname": "Ludek"}
  - {"category": "color", "firstname": "Marek", "lastname": "Kot"}
  - {"category": "food", "firstname": "Marek", "lastname": "Kot"}
  `;
  const completionResult = await completion({system, instruction, user: `Remember do not answer question: ${question}`});
  console.log('completionResult', completionResult);
  return JSON.parse(completionResult.choices[0].message.content);
}


function createFilterFindPerson(analyzedQuestion) {
  return {
    must: [
      {
        key: 'collection',
        match: {
          value: COLLECTION_NAME,
        }
      },
      {
        key: 'nazwisko',
        match: {
          value: analyzedQuestion.lastname,
        }
      }
    ],
    should: [
      {
        key: 'imie',
        match: {
          value: analyzedQuestion.firstname,
        }
      }
    ]
  }
}
async function answerGivenQuestionUsingContext(question, userObject) {
  const system = 'Your responsibility is to answer given question based on known facts';
  const context = `Facts: - firstname: ${userObject.imie} - lastname: ${userObject.nazwisko} - about: ${userObject.o_mnie}`;
  const instruction = 'Be concise. Answer using minimal number of words. Single word if possible';

  return completion({system, context, instruction, user: question});
}

async function submitAnswer(answer) {
  console.log('the final answer', answer);

  const token = await getToken();
  const result = await sendAnswer(answer, token);
  console.log('result', result);
}

export async function day14people() {
  const task = await getTodayTask();
  console.log('task', task);

  /*
  msg: 'retrieve the data set (JSON) and answer the question. The question will change every time the task is called. I only ask about favourite colour, favourite food and place of residence',
  data: 'https://zadania.aidevs.pl/data/people.json',
  question: 'Gdzie mieszka Krysia Ludek?', / Ulubiony kolor Agnieszki Rozkaz, to? / powiedz mi, gdzie mieszka Katarzyna Truskawka? w jakim mieście?
  hint1: 'Does everything have to be handled by the language model?',
  hint2: 'prepare knowledge DB for this task'
   */

  const user = task.question;

  const url = 'https://zadania.aidevs.pl/data/people.json';

  const fileResponse = await fetch(url);
  const fileContent = await fileResponse.json();
  // console.log('fileContent', fileContent);

  await initCollectionIfRequired(COLLECTION_NAME);

  const collectionInfo = await getCollectionInfo(COLLECTION_NAME);

  if (!collectionInfo.points_count) {
    console.log('going to insert documents into db');
    // index documents
    await insertDocuments(fileContent);
  }

  console.log('going to analyze question');

  const analyzedQuestion = await analyseQuestion(user);
  console.log('analyzedQuestion', analyzedQuestion);

  /*
  {
  "category": "residence",
  "firstname": "Krysia",
  "lastname": "Ludek"
}
   */

  const embeddingOfQuestionResult = await embedding(user);
  console.log('embeddingOfQuestionResult', embeddingOfQuestionResult);

  const filterFindPerson = createFilterFindPerson(analyzedQuestion);
  const matchedPerson = await findOne(COLLECTION_NAME, embeddingOfQuestionResult.data[0].embedding, filterFindPerson);
  console.log('matchedPerson', user, matchedPerson);

  if (analyzedQuestion.category === 'color') {
    const answerAsColor = matchedPerson[0].payload.ulubiony_kolor;
    await submitAnswer(answerAsColor);
  } else {
    const answer = await answerGivenQuestionUsingContext(user, matchByQuestion[0].payload);
    console.log('answer', answer);
    await submitAnswer(answer.choices[0].message.content);
  }

}

