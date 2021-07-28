/* eslint-disable camelcase */
import client from 'axios';
import { z } from 'zod';
import logger from '../../logging';
import { AmbLocation } from '../amb/amb.service';

const tomValue = z.object({
  // TODO: other metrics
  treeIndex: z.number(),
});
const tomInterval = z.object({
  startTime: z.string(),
  values: z.array(tomValue),
});
const tomTimestep = z.object({
  startTime: z.string(),
  endTime: z.string(),
  intervals: z.array(tomInterval),
});
const tomTimelines = z.object({
  timelines: z.array(tomTimestep),
});
export type TomData = z.infer<typeof tomTimelines>;

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const TomClient = (token: string) => {
  const TOM_API = 'https://api.tomorrow.io';
  const httpClient = client.create();
  httpClient.interceptors.request.use(req => {
    req.params.key = token;
    return req;
  });

  return {
    getLatestPollen(location: AmbLocation) {
      return httpClient.get<unknown>(
        // eslint-disable-next-line max-len
        `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=metric&timesteps=current&fields=treeIndex`,
      ).then(r => tomTimelines.parse(r.data))
        .catch(e => {
          logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
          throw new Error('An error occured calling the pollen api');
        });
    },
  };
};
