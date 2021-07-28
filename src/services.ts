/* eslint-disable import/prefer-default-export */
import { WebClient } from '@slack/web-api';
import { TomClient } from './sources/tom/tom.service';

const slackToken = process.env.SLACK_TOKEN;
const tomToken = process.env.TOM_TOKEN;

if (!slackToken) {
  throw new Error("No slack token found, can't start");
}
if (!tomToken) {
  throw new Error("No tom token found, can't start");
}

const slackClient = new WebClient(slackToken);
// const ambClient = AmbClient(ambToken);
const tomClient = TomClient(tomToken);
export { slackClient, tomClient };
