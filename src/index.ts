import { Request, Response } from 'express';
import { getSlackChallenge, sendStatsReply, verifyWebhook } from './slack';
import { getStatsMessage } from './stats';
import logger from './logging';
import { ambClient } from './services';

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
  const message = getStatsMessage(req.body);
  await sendStatsReply(message, req.body.event.channel).catch(e => {
    logger.error(`An error occured sending the message out: ${e.stack}`);
  });

  res
    .status(200)
    .end();
}

export async function getPollenStats(req: Request, res: Response): Promise<void> {
  const DALLAS = {
    lat: 32.8,
    lng: -96.8,
  };
  if (req.body.challenge) {
    // for initial verification of the webhook from slack
    getSlackChallenge(req, res);
  }

  verifyWebhook(req); // side effects on failure only

  logger.info('Req verified, attempting to get Pollen stats');
  const maybePollen = await ambClient.getLatestPollen(DALLAS);

  res
    .status(200)
    .end();
}
