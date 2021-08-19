# Chat Bot with Pollen notifier

Based on <https://github.com/ptone/node-cloud-function-boiler>

This is a slack bot that does precisely two things:

* Responds to being @'d by calculating certain information and responding with that information to the user
* When hitting a deployed endpoint, responds to the configured channel with a information about the current pollen information for the day

## Install

```bash
yarn
```

## Dev

```bash
yarn run dev
```

## Pollen Stats

Pollen stats, when invoked from the gcp function, will call the Tomorrow.io Pollen API, format the response, and send it to the hardcoded channel if the pollen levels are above "Very Low".  The location to retrieve the pollen information for is also hardcoded, largely because I decided that further configuration development was not worth the time investment.

Both of those could be moved out and into a config somewhere, as well as some way of attaching a location to a user and having the bot DM them instead of putting it in a single channel, that way locations and users could be bound together, giving each user a customized pollen report for their location.

I am interested in other, more granular pollen data sources, but there aren't many that are computer friendly.

### Future Pollen Work

This service has a hardcoded response channel, and pollen location.  Both of those could be moved into config

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
