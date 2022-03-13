# Chat Bot with Pollen notifier

Based on <https://github.com/ptone/node-cloud-function-boiler>

This is a slack bot that does precisely two things:

* Responds to being @'d by calculating certain information and responding with that information to the user
* When hitting a deployed endpoint, responds to the configured channel with a information about the current pollen information for the day

## Prerequisites

* Node 12
* npm
* yarn

## Install

```bash
yarn install
```

## Build

```bash
yarn compile
```

## Build and Deploy

Secrets are deployed with the gcloud function, and are passed in from the environment.  The secrets and function name are required for the setup, so setting up for a specific deploy run is the most complicated part of the deploy.  It looks roughly like:

```bash
export FUNCTION_TARGET=''
export SLACK_SIGNING_SECRET=''
export SLACK_TOKEN=''
export PSENSE_TOKEN=''
export POLLEN_CHANNEL=''
yarn run build-deploy
```

## Pollen Stats

Pollen stats, when invoked from the gcp function, will call the Pollen Sense Point API for the current day, format the response, and send it to the hardcoded channel if the pollen misery level daily average high is above 33 (on a scale from 0-100).


### Future Pollen Work

This service has a hardcoded response channel and pollen location.  Both of those could be moved into config easily, but that is not considered a priority for development at this time.

## Doggo-Miles

If you @ doggo bot in a channel it is in with the following format, it will calculate your animal/miles:

```md
@doggo-bot x miles
y doggos
x cats
z squirrels
```

Doggo bot will calculate the animal/miles from the input.  The input needs to be newline deliminted, and the only animals it will recognize are the strings "doggo", "cat", and "squirrel".

### Future Doggo Miles Work

There is a lot of room for config here, and better language processing. The list of animals could be expanded, moved into a config file, or drawn from some database of animals.  The text processing is not particularly robust, and could be expanded to use natural language processing rules to parse the incoming messages, making the bot more flexible.

Further down the road, it could be expanded with tracking persistence, and log a user's miles and report a leaderboard, etc.

## Architecture

This bot is written as a typescript > js bot that uses the slack api for communication to configured channels.
