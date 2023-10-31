import dotenv from 'dotenv';
import {day01} from './day01/helloai.js';
import {day04Moderation} from './day04/moderation.js';

import {inspect} from 'util';
import {day04Blog} from './day04/blogger.js';
import {day05Liar} from './day05/liar.js';
import {day06Inprompt} from './day06/inprompt.js';

dotenv.config();

inspect.defaultOptions.depth = null;

if (1 === 0) {
  day01();
  day04Moderation();
  day04Blog();
  day05Liar();
}
day06Inprompt();
