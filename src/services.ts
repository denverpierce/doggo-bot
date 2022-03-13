/* eslint-disable import/prefer-default-export */
import { WebClient } from '@slack/web-api';
import { PSenseService } from './sources/psense/psense.service';

const slackToken = process.env.SLACK_TOKEN;
const pSenseToken = process.env.PSENSE_TOKEN;

if (!slackToken) {
  throw new Error("No slack token found, can't start");
}
if (!pSenseToken) {
  throw new Error("No tom token found, can't start");
}

const slackClient = new WebClient(slackToken);
const pSenseService = PSenseService(pSenseToken);
export { slackClient, pSenseService };
