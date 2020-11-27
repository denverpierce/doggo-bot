import { logger } from '.';
import { calculateStats } from './calcs';
import { findAndParseStatLine } from './parsers';
import { SlackWebHookEvent } from './slack';

const ANIMAL_DOGGOS = 'doggos';
export const ANIMALS_ALL = [ANIMAL_DOGGOS];

const MILES = 'miles'; // not the cat
export type Stats = typeof ANIMAL_DOGGOS | typeof MILES; // add other animals
export const getStatsMessage = (msg: SlackWebHookEvent): string => {
  logger.info(`Beginning parse pass, submitted event: ${JSON.stringify(msg.event)}`);
  try {
    const parsedDoggos = findAndParseStatLine(msg.event.text, ANIMAL_DOGGOS);
    const parsedMiles = findAndParseStatLine(msg.event.text, MILES);
    logger.info(`${parsedDoggos.stat} as ${parsedDoggos.parsedValue}`);
    return calculateStats(parsedDoggos, parsedMiles);
  } catch (e) {
    logger.error(`Parse failed, error stack: ${e.stack}`);
    throw new Error('Parse failed');
  }
};
