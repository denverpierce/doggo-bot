#!/usr/bin/env bash

set -eux 
set -o pipefail

# these won't actually do anything, as the sets at the top cause the acceses to fail
if [ -z "${FUNCTION_TARGET}" ]; then echo "FUNCTION_TARGET is unset" exit 1; else echo "FUNCTION_TARGET is set"; fi
if [ -z "${SLACK_SIGNING_SECRET}" ]; then echo "SLACK_SIGNING_SECRET is unset" exit 1; else echo "SLACK_SIGNING_SECRET is set"; fi
if [ -z "${SLACK_TOKEN}" ]; then echo "SLACK_TOKEN is unset" exit 1; else echo "SLACK_TOKEN is set"; fi
if [ -z "${AMB_TOKEN}" ]; then echo "AMB_TOKEN is unset" exit 1; else echo "AMB_TOKEN is set"; fi
if [ -z "${POLLEN_CHANNEL}" ]; then echo "POLLEN_CHANNEL is unset" exit 1; else echo "POLLEN_CHANNEL is set"; fi

cp package.json build
yarn run compile
gcloud functions deploy "$FUNCTION_TARGET" \
--runtime nodejs12 \
--trigger-http \
--set-env-vars "SLACK_SIGNING_SECRET=$SLACK_SIGNING_SECRET,SLACK_TOKEN=$SLACK_TOKEN,AMB_TOKEN=$AMB_TOKEN,POLLEN_CHANNEL=$POLLEN_CHANNEL" \
--allow-unauthenticated \
--source "./build"