import { createEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/web-api';

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = process.env.PORT || 3000;

if (!slackSigningSecret) {
  throw new Error("No secret found, can't start");
}
if (!slackToken) {
  throw new Error("No token found, can't start");
}

const eventAdapter = createEventAdapter(slackSigningSecret);
// const server = await eventAdapter.start(port as number); // TODO: fix
const slackClient = new WebClient(slackToken);
export { eventAdapter, slackClient };
