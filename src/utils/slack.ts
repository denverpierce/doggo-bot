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
import { Request } from 'express';
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
  const slackTimestamp = req.headers['x-slack-request-timestamp']
  if (!process.env.SLACK_SECRET) {
    throw new Error('Secret not found, exiting.')
  }
  if (!slackSig ||
    typeof slackSig !== 'string' ||
    !slackTimestamp ||
    typeof slackTimestamp !== 'number'
  ) {
    throw new Error("ow")
  }
  const signature: VerifyRequestSignatureParams = {
    signingSecret: process.env.SLACK_SECRET,
    requestSignature: slackSig,
    requestTimestamp: slackTimestamp,
    //@ts-ignore #notmytypes
    body: req.rawBody,
  };

  if (!verifyRequestSignature(signature)) {
    const error = new Error('Invalid credentials');
    throw error;
  }
};

/**
 * Format the Knowledge Graph API response into a richly formatted Slack message.
 *
 * @param {string} message The message to be formatted.
 * @returns {object} The formatted message.
 */
export const formatSlackMessage = (message:string) => {
  // Prepare a rich Slack message
  // See https://api.slack.com/docs/message-formatting
  const slackMessage:{response_type:string, text:string} = {
    response_type: 'in_channel',
    text: message,
  };
  return slackMessage;
};