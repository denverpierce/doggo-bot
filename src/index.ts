import { Request, Response } from 'express';
import { createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { sendStatsReply, verifyWebhook } from './slack';
import { getStatsMessage } from './stats';

// set up logging (note FUNCTION_TARGET has replaced FUNCTION_NAME as reserved env var)
const loggingWinston = new LoggingWinston({ logName: process.env.FUNCTION_TARGET });
export const logger = createLogger({
  level: 'info',
  transports: [
    // goes to functions log
    new transports.Console(),
    // goes to named log, under "Global" resource
    loggingWinston,
  ],
});

export async function getDoggoStats(req: Request, res: Response) {
  if (req.body.challenge) {
    // for initial verification of the webhook from slack
    res
      .status(200)
      .type('application/json')
      .send(JSON.stringify({
        challenge: req.body.challenge,
      }));
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
