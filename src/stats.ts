import logger from './logging';
import { calculateStats } from './calcs';
import { findAndParseStatLine } from './parsers';
import { SlackWebHookEvent } from './slack';

// TODO: plural string support
// const ANIMAL_DOGGOS = /(doggos?)/i;
// const ANIMAL_CATS = /(cats?)/i;

// using singlar here captures '1 doggo' but outputs the wrong pluraity on render
const ANIMAL_DOGGOS = 'doggo';
const ANIMAL_CATS = 'cat';
const ANIMAL_SQUIRREL = 'squirrel';
export const ANIMALS_ALL = [ANIMAL_DOGGOS, ANIMAL_CATS, ANIMAL_SQUIRREL] as const;

const MILES = 'miles'; // not the cat
export type Stats = typeof ANIMAL_DOGGOS | typeof MILES; // add other animals
export const getStatsMessage = (msg: SlackWebHookEvent): string[] => {
  logger.info(`Beginning parse pass, submitted event: ${JSON.stringify(msg.event)}`);
  try {
    const parsedMiles = findAndParseStatLine(msg.event.text, MILES);

    return ANIMALS_ALL.map(animal => findAndParseStatLine(msg.event.text, animal))
      .map(t => {
        // wtb tap()
        logger.info(`Parsed animal: ${JSON.stringify(t)}`);
        return t;
      })
      .filter(a => a.parsedValue) // filter out unfound lines
      .map(foundAnimal => calculateStats(foundAnimal, parsedMiles));
  } catch (e) {
    logger.error(`Parse failed, error stack: ${e.stack}`);
    throw new Error('Parse failed');
  }
};
