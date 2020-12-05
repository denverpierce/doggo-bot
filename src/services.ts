/* eslint-disable import/prefer-default-export */
import { WebClient } from '@slack/web-api';
import { AmbClient } from './amb';

const slackToken = process.env.SLACK_TOKEN;
const ambToken = process.env.AMB_TOKEN;

if (!slackToken) {
  throw new Error("No slack token found, can't start");
}
if (!ambToken) {
  throw new Error("No amb token found, can't start");
}

const slackClient = new WebClient(slackToken);
const ambClient = AmbClient(ambToken);
export { slackClient, ambClient };
