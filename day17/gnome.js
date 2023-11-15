import {getTask, getToken, sendAnswer} from '../common/ai-devs-api.js';
import {imageAnalysis} from '../common/openai-api.js';

const TASK_NAME = 'gnome';

export async function day17gnome() {
  const token = await getToken(TASK_NAME);
  const task = await getTask(token);
  console.log('task', task);

  /*
  msg: 'I will give you a drawing of a gnome with a hat on his head. Tell me what is the color of the hat in POLISH. If any errors occur, return "ERROR" as answer',
  hint: "it won't always be a drawing of a gnome >:)",
  url: 'https://zadania.aidevs.pl/gnome/cb1a03fb3d7eca2dd5a139eb76f44111.png'
   */

  const user = `
  Is there a gnome in the image? If so, does he have a hat? If so, what is the color of the hat?
  Translate color name to polish.
  Answer using JSON.
  ###
  Examples:
  - {"gnome":true,"hat":false}
  - {"gnome":true,"hat":true,"color":"niebieski"}
  `;
  const imageUrl = task.url;
  const maxTokens = 300;

  const imageAnalysisResult = await imageAnalysis({user, imageUrl, maxTokens});
  console.log('imageAnalysisResult', imageAnalysisResult);

  const serializedJson = imageAnalysisResult.choices[0].message.content
    .replace('```json\n', '')
    .replace('\n```', '');

  console.log('serializedJson', serializedJson);
  const anObject = JSON.parse(serializedJson);
  const answer = anObject.color ? anObject.color : 'error';

  const result = await sendAnswer(answer, token);
  console.log('result', result);
}
