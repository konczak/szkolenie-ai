import {authorize, getTask, sendAnswer} from '../common/ai-devs-api.js';
import {embedding} from '../common/openai-api.js';
import {v4 as uuidv4} from 'uuid';
import {createCollection, findOne, getCollectionInfo, getQdrantCollections, insertInto} from '../common/qdrant-db.js';


const TASK_NAME = 'search';
const COLLECTION_NAME = 'szkolenie_day13_search';

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

async function isCollectionIndexed(collectionName) {
  const collections = await getQdrantCollections();

  const indexed = collections.collections.find((collection) => collection.name === collectionName);
  return !!indexed;
}

async function insertDocuments(fileContent) {
  /*
  fileContent is array of objects:
  title, url, info, date
 */
  const myDocuments = fileContent.map((aiDevsDoc) => {
    const doc = new MyDocument();
    doc.metadata.collection = COLLECTION_NAME;
    doc.metadata.url = aiDevsDoc.url;
    doc.metadata.date = aiDevsDoc.date;
    doc.metadata.title = aiDevsDoc.title;
    doc.metadata.info = aiDevsDoc.info;
    // doc.pageContent = `title: ${aiDevsDoc.title} ### info: ${aiDevsDoc.info}`;
    doc.pageContent = aiDevsDoc.info;
    return doc;
  });

  // Generate embeddings
  const points = [];
  // for (let n = 0; n < myDocuments.length; n++) {
  for (let n = 155; n < 175; n++) {
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

export async function day13search() {
  const task = await getTodayTask();
  console.log('task', task);

  const url = 'https://unknow.news/archiwum.json';

  const fileResponse = await fetch(url);
  const fileContent = await fileResponse.json();
  console.log('fileContent', fileContent);

  const indexed = await isCollectionIndexed(COLLECTION_NAME);
  console.log('indexed', indexed);
  // Create collection if not exists
  if (!indexed) {
    await createCollection(COLLECTION_NAME);
  }

  const collectionInfo = await getCollectionInfo(COLLECTION_NAME);

  if (!collectionInfo.points_count) {
    // index documents
    await insertDocuments(fileContent);
  }

  const question = task.question;
  const questionEmbeddingResult = await embedding(question);
  console.log('question vs questionEmbeddingResult', question, questionEmbeddingResult);
  const questionEmbedding = questionEmbeddingResult.data[0].embedding;

  const foundAnswer = await findOne(COLLECTION_NAME, questionEmbedding);
  console.log('foundAnswer', foundAnswer);

  const answer = foundAnswer[0].payload.url;
  const token = await getToken();
  const result = await sendAnswer(answer, token);
  console.log('result', result);
}

