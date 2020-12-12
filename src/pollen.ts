import { SectionBlock } from '@slack/web-api';
import { AmbLocation, AmbPollenGeospatial, POLLEN_LOW } from './amb';
import { ambClient } from './services';
import { getTypedKeys } from './utils';
import logger from './logging';

// TODO: output the pollen counts when risk is high
const pollenRiskToBlock = (
  pollenKey: keyof AmbPollenGeospatial['Risk'],
  pollenRisk: AmbPollenGeospatial['Risk'],
): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `Risk of ${pollenKey} is ${pollenRisk[pollenKey]}`,
  },
});

const pollenIntro: SectionBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: 'I smell something bad in the air :dog2:.  Be careful of these baddies: ',
  },
};

// eslint-disable-next-line import/prefer-default-export
export const getPollenStatus = async (
  location: AmbLocation,
): Promise<SectionBlock[] | undefined> => {
  const { data: pollenData } = await ambClient.getLatestPollen(location);
  logger.info(`Pollen data received, attempting to build blocks for: ${JSON.stringify(pollenData)}`);
  const pollenBlocks = pollenData.data
    .map(rawPollen => rawPollen.Risk) // just want the risk data for now
    .flatMap(pollenRisk => {
      // pull off, then render only the risky pollens
      const riskyPollen = getTypedKeys(pollenRisk)
        .filter(risk => pollenRisk[risk] !== POLLEN_LOW);
      return riskyPollen.map(riskyPollenKey => pollenRiskToBlock(riskyPollenKey, pollenRisk));
    });
  if (pollenBlocks.length === 0) return undefined;
  return [pollenIntro, ...pollenBlocks];
};
