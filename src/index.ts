import { Request, Response } from "express"
import { createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { formatSlackMessage, verifyWebhook } from "./utils/slack";
import { getStatsMessage } from "./cmd/stats";

// set up logging (note FUNCTION_TARGET has replaced FUNCTION_NAME as reserved env var)
const loggingWinston = new LoggingWinston({ 'logName': process.env['FUNCTION_TARGET'] });
export const logger = createLogger({
    level: 'info',
    transports: [
        // goes to functions log
        new transports.Console(),
        // goes to named log, under "Global" resource
        loggingWinston,
    ],
});

export function getDoggoStats(req: Request, res: Response) {
    if(req.body.challenge){
        res
        .status(200)
        .type("application/json")
        .send(JSON.stringify({
            challenge: req.body.challenge
        }))
    }
    logger.info("Attempting to get Doggo stats");

    verifyWebhook(req); // side effects on failure only

    const message = getStatsMessage(req.body);
    const formattedSlackRespone = formatSlackMessage(message);

    res
        .status(200)
        .type("application/json")
        .send(JSON.stringify(formattedSlackRespone))
        .end()
}
