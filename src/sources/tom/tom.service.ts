/* eslint-disable camelcase */
import client from 'axios';
import { z } from 'zod';
import logger from '../../logging';
import { AmbLocation } from '../amb/amb.service';

const tomIndexValues = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

const tomValue = z.object({
  treeIndex: tomIndexValues,
  weedIndex: tomIndexValues,
  grassIndex: tomIndexValues,
});
const tomInterval = z.object({
  startTime: z.string(),
  values: tomValue,
});
const tomTimestep = z.object({
  startTime: z.string(),
  endTime: z.string(),
  intervals: z.array(tomInterval),
});
const tomTimelines = z.object({
  timelines: z.array(tomTimestep),
});
const tomData = z.object({
  data: tomTimelines,
});
export type TomData = z.infer<typeof tomTimelines>;

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const TomClient = (token: string) => {
  const TOM_API = 'https://api.tomorrow.io';
  const httpClient = client.create();

  return {
    getLatestPollen(location: AmbLocation) {
      // eslint-disable-next-line max-len
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=metric&timesteps=current&fields=treeIndex,grassIndex,weedIndex&apikey=${token}`;
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          const maybeParsedData = tomData.safeParse(r.data);
          if (!maybeParsedData.success) {
            logger.error(`Tom Pollen parsing error: ${JSON.stringify(maybeParsedData.error)}`);
            throw new Error('Data didnt parse correctly');
          }
          return maybeParsedData.data.data;
        });
      // .catch(e => {
      //   logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
      //   throw new Error('An error occured calling the pollen api');
      // });
    },
  };
};
