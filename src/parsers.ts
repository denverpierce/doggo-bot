export type ParsedLine<S> = { stat: S; parsedValue: number | string | undefined };
export const findAndParseStatLine = (msg: string, stat: string): ParsedLine<string> => {
  const statLine = msg
    .split('\\n')
    .map(l => l.toLocaleLowerCase())
    .find(l => l.includes(stat));

  if (!statLine) {
    return { stat: stat, parsedValue: undefined };
  }
  const statString = statLine.match(/(\d{1,3}\.?\d{0,3})/g);
  if (!statString) {
    return {
      stat: stat,
      parsedValue: `I found ${stat}, but couldn't figure out how many :(`,
    };
  }
  const statNumber = parseFloat(statString[0]);
  if (!Number.isFinite(statNumber)) {
    return {
      stat: stat,
      parsedValue: `I found ${stat}, but couldn't figure out how many :(`,
    };
  }
  return { stat: stat, parsedValue: statNumber };
};
