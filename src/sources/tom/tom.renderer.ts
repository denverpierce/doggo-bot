import type { SectionBlock } from '@slack/web-api';
import logger from '../../logging';
import { pollenIntro } from '../amb/amb.renderer';
import { TomData } from './tom.service';

const pollenIndexToBlock = (
  treeIndex: number,
): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    // TODO: make this run against multiple metrics
    text: `*Tree Pollen* is currently *${treeIndex}*`,
  },
});

/* eslint-disable import/prefer-default-export */
export const tomPollenToSlack = (
  pollenData: TomData,
): SectionBlock[] | undefined => {
  logger.info(`Pollen data received, attempting to build blocks for: ${JSON.stringify(pollenData)}`);
  const pollenBlocks:SectionBlock[] = pollenData.timelines
    .flatMap(tms => tms.intervals)
    .flatMap(i => i.values)
    .flatMap(v => v.treeIndex)
    .map(pollenIndexToBlock);
  if (pollenBlocks.length === 0) return undefined;
  return [pollenIntro, ...pollenBlocks];
};
