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
  data: tomTimelines
})
export type TomData = z.infer<typeof tomTimelines>;

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const TomClient = (token: string) => {
  const TOM_API = 'https://api.tomorrow.io';
  const httpClient = client.create();

  return {
    getLatestPollen(location: AmbLocation) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=metric&timesteps=current&fields=treeIndex&apikey=${token}`
      logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          logger.info(JSON.stringify(r.data))
          const maybeParsedData = tomData.safeParse(r.data);
          if (!maybeParsedData.success) {
            logger.error(`Tom Pollen parsing error: ${JSON.stringify(maybeParsedData.error)}`)
            throw new Error('Data didnt parse correctly')
          }
          return maybeParsedData.data.data;
        })
        // .catch(e => {
        //   logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
        //   throw new Error('An error occured calling the pollen api');
        // });
    },
  };
};
