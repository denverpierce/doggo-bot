export type ParsedLine<S> = { stat: S; parsedValue: number | string | undefined };
export const findAndParseStatLine = (msg: string, stat: string): ParsedLine<string> => {
  const statLine = msg
    .split('\n')
    .map(l => l.toLocaleLowerCase())
    .find(l => l.includes(stat));

  if (!statLine) {
    return { stat: stat, parsedValue: undefined };
  }
  const statString = statLine.match(/(\d{1,3}\.?\d{0,3})/i);
  if (!statString) {
    return {
      stat: stat,
      parsedValue: `I found ${stat}, but couldn't figure out how many :(`,
    };
  }
  // @ts-ignore types are wrong here
  const statNumber = parseFloat(statString);
  if (!Number.isFinite(statNumber)) {
    return {
      stat: stat,
      parsedValue: `I found ${stat}, but couldn't count them :(`,
    };
  }
  return { stat: stat, parsedValue: statNumber };
};
