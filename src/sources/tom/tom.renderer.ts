import type { SectionBlock } from '@slack/web-api';
import logger from '../../logging';
import { getTypedKeys } from '../../utils';
import { pollenIntro } from '../amb/amb.renderer';
import { TomData } from './tom.service';

type TomPollenIndicies = TomData["timelines"][0]["intervals"][0]["values"]

const tomPollenIndexToLabelMap = {
  [0]: 'None',
  [1]: 'Very low',
  [2]: 'Low',
  [3]: 'Medium',
  [4]: 'High',
  [5]: 'Very High'
}

const pollenRiskToBlock = (
  currentKey: keyof TomPollenIndicies,
  pollenIndicies: TomPollenIndicies,
): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `Risk of *${currentKey.replace('Index', ' Pollen').toLocaleUpperCase()}* is *${tomPollenIndexToLabelMap[pollenIndicies[currentKey]]}*`,
  },
});

export const tomPollenToSlack = (
  pollenData: TomData,
): SectionBlock[] | undefined => {
  logger.info(`Pollen data received, attempting to build blocks for: ${JSON.stringify(pollenData)}`);
  const pollenBlocks:SectionBlock[] = pollenData.timelines
    .flatMap(tms => tms.intervals)
    .flatMap(i => i.values)
    .flatMap(pollenIndicies => {
      const riskyPollenKeys = getTypedKeys(pollenIndicies)
        .filter(risk => pollenIndicies[risk] >= 1); // only build/send messages if pollen index is equal or above "Low"
        return riskyPollenKeys.map(riskyPollenKey => pollenRiskToBlock(riskyPollenKey, pollenIndicies));
    })
  if (pollenBlocks.length === 0) return undefined;
  return [pollenIntro, ...pollenBlocks];
};
