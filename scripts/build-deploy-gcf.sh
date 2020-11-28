#!/usr/bin/env bash

set -eux 
set -o pipefail

# these won't actually do anything, as the sets at the top cause the acceses to fail
if [ -z "${FUNCTION_TARGET}" ]; then echo "FUNCTION_TARGET is unset" exit 1; else echo "FUNCTION_TARGET is set"; fi
if [ -z "${SLACK_SIGNING_SECRET}" ]; then echo "SLACK_SIGNING_SECRET is unset" exit 1; else echo "SLACK_SIGNING_SECRET is set"; fi
if [ -z "${SLACK_TOKEN}" ]; then echo "SLACK_TOKEN is unset" exit 1; else echo "SLACK_TOKEN is set"; fi

cp package.json build
yarn run compile
gcloud functions deploy "$FUNCTION_TARGET" \
--runtime nodejs10 \
--trigger-http \
--set-env-vars "SLACK_SIGNING_SECRET=$SLACK_SIGNING_SECRET,SLACK_TOKEN=$SLACK_TOKEN" \
--allow-unauthenticated \
--source "./build"