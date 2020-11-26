import { ChatMeMessageArguments } from '@slack/web-api';
import { logger } from '..';
import { calculateStats } from '../utils/calcs';
import { findAndParseStatLine } from '../utils/parsers';

const ANIMAL_DOGGOS = 'doggos';
export const ANIMALS_ALL = [ANIMAL_DOGGOS];

const MILES = 'miles'; // not the cat
export type Stats = typeof ANIMAL_DOGGOS | typeof MILES; // add other animals

export const getStatsMessage = (msg: ChatMeMessageArguments) => {
  logger.info('Beginning parse pass, message: ', msg.text);
  const parsedDoggos = findAndParseStatLine(msg.text, ANIMAL_DOGGOS);
  const parsedMiles = findAndParseStatLine(msg.text, MILES);
  logger.info(`${parsedDoggos.stat} as ${parsedDoggos.parsedValue}`);
  return calculateStats(parsedDoggos, parsedMiles);
};
