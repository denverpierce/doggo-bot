/* eslint-disable camelcase */
import client from 'axios';
import { z } from 'zod';
import logger from '../../logging';
import { AmbLocation } from '../amb/amb.service';

// it is possible that a new string is added to this list,
// which will break the parsing and cause the function not to run
const pSenseCategorieCodes = z.enum(['GRA', 'MOL', 'OTHPAR', 'POL', 'TRE', 'WEE']);
const pSenseCategory = z.object({
  CategoryCode: pSenseCategorieCodes,
  PPM3Averages: z.number().array(),
  PPM3Highs: z.number().array(),
  PPM3Lows: z.number().array(),
  MiseryAverages: z.number().array(),
  MiseryHighs: z.number().array(),
  MiseryLows: z.number().array(),
});
export const PSenseData = z.object({
  Moments: z.string().array(),
  Categories: pSenseCategory.array(),
});
export type tPSenseData = z.infer<typeof PSenseData>;

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const PSenseService = (token: string) => {
  // api docs:
  // https://portal.pollensense.com/api/point

  const PSENSE_API = 'https://model.pollensense.com';
  const httpClient = client.create();
  const TODAY = new Date().toISOString(); // what TZ does this come in?

  return {
    getLatestPollen(location: AmbLocation) {
      // eslint-disable-next-line max-len
      const url = `${PSENSE_API}/api/point?lat=${location.lat}&lon=${location.lng}&starting=${TODAY}&key=${token}&agg=HL&level=2`;
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          const maybeParsedData = PSenseData.safeParse(r.data);
          if (!maybeParsedData.success) {
            logger.error(`PSense Pollen parsing error: ${JSON.stringify(maybeParsedData.error)}`);
            throw new Error('Data didn\'t parse correctly');
          }
          return maybeParsedData.data;
        })
        .catch(e => {
          logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
          throw new Error('An error occured calling the pollen api');
        });
    },
  };
};
