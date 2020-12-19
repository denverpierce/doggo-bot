// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import {
  getSlackChallenge, renderStatsResponse, sendBlocksMessage, verifyWebhook,
} from './slack';
import { getStatsMessage } from './stats';
import logger from './logging';
import { getPollenStatus } from './pollen';

export async function getDoggoStats(req: Request, res: Response): Promise<void> {
  if (req.body.challenge) {
    // for initial verification of the webhook from slack
    getSlackChallenge(req, res);
  }
  if (req.query.code) {
    // for initial verification of the webhook from slack
    logger.info(JSON.stringify(req));
    res.status(200).send('Yer good fam').end();
  }

  verifyWebhook(req); // side effects on failure only

  logger.info('Req verified, attempting to get Doggo stats');
  const messages = getStatsMessage(req.body);
  await sendBlocksMessage(renderStatsResponse(messages), req.body.event.channel).catch(e => {
    logger.error(`An error occured sending the message out: ${e.stack}`);
  });

  res
    .status(200)
    .end();
}

export async function getPollenStats(req: Request, res: Response): Promise<void> {
  // TODO: make location configureable
  const DALLAS = {
    lat: 32.8,
    lng: -96.8,
  };
  // TODO: make channel configureable
  const CHANNEL = process.env.POLLEN_CHANNEL;
  if (!CHANNEL) throw new Error('Pollen channel not found, exiting');
  if (req.body.challenge) {
    // for initial verification of the webhook from slack
    getSlackChallenge(req, res);
  }

  logger.info('Req received, attempting to get Pollen stats');
  const maybePollen = await getPollenStatus(DALLAS);
  if (maybePollen) {
    sendBlocksMessage(maybePollen, CHANNEL);
  } else {
    logger.info('Request received, but no pollen risk was found, so no message was sent.');
  }

  res
    .status(200)
    .end();
}
