import { Request, Response } from 'express';
import { getSlackChallenge, sendStatsReply, verifyWebhook } from './slack';
import { getStatsMessage } from './stats';
import logger from './logging';

// eslint-disable-next-line import/prefer-default-export
export async function getDoggoStats(req: Request, res: Response): Promise<void> {
  if (req.body.challenge) {
    // for initial verification of the webhook from slack
    getSlackChallenge(req, res);
  }

  verifyWebhook(req); // side effects on failure only

  logger.info('Req verified, attempting to get Doggo stats');
  const message = getStatsMessage(req.body);
  await sendStatsReply(message, req.body.event.channel).catch((e) => {
    logger.error(`An error occured sending the message out: ${e.stack}`);
  });

  res
    .status(200)
    .end();
}
