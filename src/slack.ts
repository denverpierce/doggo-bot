// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { verifyRequestSignature } from '@slack/events-api';
import { VerifyRequestSignatureParams } from '@slack/events-api/dist/http-handler';
import { WebAPICallResult } from '@slack/web-api';
import { Request } from 'express';
import { logger } from '.';
import { slackClient } from './services';

export type EventAppMention = {
  blocks: any[], // RTF version of the message
  text: string,
  type: 'app_mention',
  channel: string,
  user: string,
}

export type SlackWebHookEvent = {
  event: EventAppMention,
  token: string,
}

interface GoogleCloudHttpRequest extends Request {
  rawBody?: Buffer;
}
/**
 * Verify that the webhook request came from Slack.
 *
 * @param {object} req Cloud Function request object.
 * @param {string} req.headers Headers Slack SDK uses to authenticate request.
 * @param {string} req.rawBody Raw body of webhook request to check signature against.
 */
export const verifyWebhook = (req: GoogleCloudHttpRequest) => {
  const slackSig = req.headers['x-slack-signature'];
  const slackTimestamp = req.headers['x-slack-request-timestamp'];

  if (!process.env.SLACK_SIGNING_SECRET) {
    logger.error('Secret not found, exiting.');
    throw new Error('Secret not found, exiting.');
  }

  if (
    !slackSig
    || typeof slackSig !== 'string'
    || !slackTimestamp
    || typeof slackTimestamp !== 'string'
  ) {
    logger.error(`The slack webhook didn't have the right headers.  The headers given were: ${JSON.stringify(req.headers)}`);
    throw new Error("The slack webhook didn't have the right headers");
  }
  const signature: VerifyRequestSignatureParams = {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    requestSignature: slackSig,
    requestTimestamp: parseFloat(slackTimestamp),
    // @ts-ignore #notmytypes
    body: req.rawBody,
  };

  if (!verifyRequestSignature(signature)) {
    logger.error('Invalid credentials');
    throw new Error('Invalid credentials');
  }
};

export const sendStatsReply = (
  message: string,
  channel: string,
): Promise<WebAPICallResult> => slackClient.chat.postMessage({
  channel,
  text: message,
});
