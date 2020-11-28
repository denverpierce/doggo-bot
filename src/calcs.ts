/* eslint-disable import/prefer-default-export */
import logger from './logging';
import { ParsedLine } from './parsers';

export const calculateStats = (
  parsedAnimal: ParsedLine<string>,
  parsedMiles: ParsedLine<string>,
): string => {
  // TODO: this func should just calculate the stat miles
  // and messaging should be moved somewhere else
  // TODO tuple or w/e
  logger.info(`Doggo parse: ${JSON.stringify(parsedAnimal)}`);
  logger.info(`Miles parse: ${JSON.stringify(parsedMiles)}`);
  if (
    typeof parsedAnimal.parsedValue === 'number'
    && typeof parsedMiles.parsedValue === 'number'
  ) {
    const animals = parsedAnimal.parsedValue;
    const miles = parsedMiles.parsedValue;
    const animalMiles = animals / miles;
    if (Number.isFinite(animalMiles)) {
      return `You went ${animalMiles.toFixed(1)} ${parsedAnimal.stat} miles! Amazing!`;
    }
  }
  return `I couldn't figure out how many ${parsedAnimal.stat} miles you did :(`;
};
