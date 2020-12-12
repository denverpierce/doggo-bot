import { createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// set up logging (note FUNCTION_TARGET has replaced FUNCTION_NAME as reserved env var)
const loggingWinston = new LoggingWinston({ logName: process.env.FUNCTION_TARGET });
export default createLogger({
  level: 'info',
  transports: [
    // goes to functions log
    new transports.Console(),
    // goes to named log, under "Global" resource
    loggingWinston,
  ],
});
