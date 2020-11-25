import { eventAdapter, slackClient } from '../config';

eventAdapter.on('app_mention', (msg) => {
  /*
  7.8 miles
73 doggos
20+ squirrels
3 cats
Done in ~2 hours. Solid 30 minutes faster than last time
*/
  const parsedDoggos = findAndParseStateLine(msg.text, ANIMAL_DOGGOS);
  const parsedMiles = findAndParseStateLine(msg.text, MILES);
  calculateStats(parsedDoggos, parsedMiles);

  slackClient.chat.postMessage({
    channel: msg.channel,
    text: calculateStats(parsedDoggos, parsedMiles)
  }).catch((e)=>console.log(e))
});

const ANIMAL_DOGGOS = 'doggos';
const MILES = 'miles'; // not the cat
type Stats = typeof ANIMAL_DOGGOS | typeof MILES; // add other animals
const ANIMALS_ALL = [ANIMAL_DOGGOS];

type ParsedLine = { stat: Stats, parsedValue: number | string }
const findAndParseStateLine = (
  msg: string,
  stat: Stats
): ParsedLine => {
  const statLine = msg
    .split('\\n')
    .map((l) => l.toLocaleLowerCase())
    .find((l) => l.includes(stat));

  if (!statLine) {
    return { stat: stat, parsedValue: `No ${stat}? Impossible?` };
  }
  const statString = statLine.match(/(\d{1,3}\.?\d{0,3})/g)
  if (!statString) {
    return { stat: stat, parsedValue: `I found ${stat}, but couldn\'t figure out how many :(` }
  }
  const statNumber = parseFloat(statString[0]);
  if (!Number.isFinite(statNumber)) {
    return { stat: stat, parsedValue: `I found ${stat}, but couldn\'t figure out how many :(` }
  }
  return { stat: stat, parsedValue: statNumber };
}

const calculateStats = (
  parsedDoggos: ParsedLine,
  parsedMiles: ParsedLine
  ,): string => {
  // TODO tuple or w/e
  if (typeof parsedDoggos.parsedValue === 'number' &&
    typeof parsedMiles.parsedValue === 'number'
  ) {
    const doggos = parsedDoggos.parsedValue;
    const miles = parsedMiles.parsedValue;
    const doggoMiles = doggos / miles;
    if (Number.isFinite(doggoMiles)) {
      return `You went ${doggoMiles}! Amazing!`;
    }
  }
  return 'I couldnt\' figure out how many doggo miles you did :(';
}