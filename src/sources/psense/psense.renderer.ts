import type { SectionBlock } from '@slack/web-api';
import logger from '../../logging';
import { pollenIntro } from '../amb/amb.renderer';
import type { tPSenseData } from './psense.service';

const pSensePollenCategoryToLabel = {
  GRA: 'Grass',
  MOL: 'Mold',
  OTHPAR: 'Other Particles',
  POL: 'Pollen',
  TRE: 'Tree Pollen',
  WEE: 'Weed Particles',
};
const miseryIndexToLabel = (misery: number): string => {
  // SPIKE: may need to decrease the lower bound if it isn't low enough for some users
  if (misery >= 66) {
    return 'High';
  }
  if (misery >= 33 && misery < 66) {
    return 'Medium';
  }
  return 'Low';
};

const pollenCategoryToBlock = (
  currentCategory: tPSenseData['Categories'][0],
): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    // eslint-disable-next-line max-len
    text: `Risk of *${pSensePollenCategoryToLabel[currentCategory.CategoryCode]}* could get to *${miseryIndexToLabel(currentCategory.MiseryHighs[0])}* today`,
  },
});

// eslint-disable-next-line import/prefer-default-export
export const pSensePollenToSlack = (
  pollenData: tPSenseData,
): SectionBlock[] | undefined => {
  logger.info(`Pollen data received, attempting to build blocks for: ${JSON.stringify(pollenData)}`);
  const pollenBlocks: SectionBlock[] = pollenData.Categories
    .filter(cat => cat.MiseryHighs[0] > 33) // filter out low High counts so as not to spam the channel all the time
    .map(pollenCategoryToBlock);
  if (pollenBlocks.length === 0) return undefined;
  return [pollenIntro, ...pollenBlocks];
};
