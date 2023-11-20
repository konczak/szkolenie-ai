import {getTask, getToken, sendAnswer} from '../common/ai-devs-api.js';
import {renderImage} from '../common/renderform-api.js';

const TASK_NAME = 'meme';

export async function day20meme() {
  const token = await getToken(TASK_NAME);
  const task = await getTask(token);
  console.log('task', task);

  /*
  msg: 'Create meme using RednerForm API and send me the URL to JPG via /answer/ endpoint',
  service: 'https://renderform.io/',
  image: 'https://zadania.aidevs.pl/data/monkey.png',
  text: 'Gdy koledzy z pracy mówią, że ta cała automatyzacja to tylko chwilowa moda, a Ty właśnie zastąpiłeś ich jednym, prostym skryptem',
  hint: 'https://zadania.aidevs.pl/hint/meme'
   */

  /*
  Zadanie polega na wygenerowaniu mema z podanego obrazka i podanego tekstu.
  Mem ma być obrazkiem JPG o wymiarach 1080x1080.
  Powinien posiadać czarne tło, dostarczoną grafikę na środku i podpis zawierający dostarczony tekst.
   */
  // konczak-meme-template
  // my-image-container
  // my-text-container

  const renderingResult = await renderImage(task.image, task.text);
  console.log('renderingResult', renderingResult);

  /*
  {
  "requestId": "string",
  "href": "string"
  }
   */

  const resultImageUrl = renderingResult.href;

  const result = await sendAnswer(resultImageUrl, token);
  console.log('result', result);
}
