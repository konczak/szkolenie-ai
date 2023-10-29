import dotenv from 'dotenv';
import {day01} from './day01/helloai.js';
import {day04Moderation} from './day04/moderation.js';

import {inspect} from 'util';

dotenv.config();

inspect.defaultOptions.depth = null;

if (1 === 0) {
  day01();
}
day04Moderation();
