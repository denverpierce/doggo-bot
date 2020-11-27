/* eslint-disable import/prefer-default-export */
import { WebClient } from '@slack/web-api';

const slackToken = process.env.SLACK_TOKEN;

if (!slackToken) {
  throw new Error("No token found, can't start");
}

const slackClient = new WebClient(slackToken);
export { slackClient };
