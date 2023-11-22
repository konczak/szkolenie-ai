import dotenv from 'dotenv';
import {day01} from './day01/helloai.js';
import {day04Moderation} from './day04/moderation.js';

import {inspect} from 'util';
import {day04Blog} from './day04/blogger.js';
import {day05Liar} from './day05/liar.js';
import {day06Inprompt} from './day06/inprompt.js';
import {day07Embedding} from './day07/embedding.js';
import {day08whisper} from './day08/whisper.js';
import {day09functions} from './day09/functions.js';
import {day10rodo} from './day10/rodo.js';
import {day11scraper} from './day11/scraper.js';
import {day12whoami} from './day12/whoami.js';
import {day13search} from './day13/search.js';
import {day14people} from './day14/people.js';
import {day15knowledge} from './day15/knowledge.js';
import {day16tools} from './day16/tools.js';
import {day17gnome} from './day17/gnome.js';
import {day18ownapi} from './day18/ownapi.js';
import {day19ownapipro} from './day19/ownapipro.js';
import {day20meme} from './day20/meme.js';
import {day21optimaldb} from './day21/optimaldb.js';
import {day22google} from './day22/google.js';

dotenv.config();

inspect.defaultOptions.depth = null;

if (1 === 0) {
  day01();
  day04Moderation();
  day04Blog();
  day05Liar();
  day06Inprompt();
  day07Embedding();
  day08whisper();
  day09functions();
  day10rodo();
  day11scraper();
  day12whoami();
  day13search();
  day14people();
  day15knowledge();
  day16tools();
  day17gnome();
  day18ownapi();
  day19ownapipro();
  day20meme();
  day21optimaldb();
}
day22google();
