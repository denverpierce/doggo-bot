/* eslint-disable import/prefer-default-export */
import { logger } from '.';
import { ParsedLine } from './parsers';

export const calculateStats = (
  parsedDoggos: ParsedLine<string>,
  parsedMiles: ParsedLine<string>,
): string => {
  // TODO tuple or w/e
  logger.info(`Doggo parse: ${JSON.stringify(parsedDoggos)}`);
  logger.info(`Miles parse: ${JSON.stringify(parsedMiles)}`);
  if (
    typeof parsedDoggos.parsedValue === 'number'
    && typeof parsedMiles.parsedValue === 'number'
  ) {
    const doggos = parsedDoggos.parsedValue;
    const miles = parsedMiles.parsedValue;
    const doggoMiles = doggos / miles;
    if (Number.isFinite(doggoMiles)) {
      return `You went ${doggoMiles}! Amazing!`;
    }
  }
  return "I couldnt' figure out how many doggo miles you did :(";
};
