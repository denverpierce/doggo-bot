/* eslint-disable camelcase */
import client from 'axios';
import logger from '../../logging';

export const POLLEN_LOW = 'Low';
const POLLEN_MED = 'Med';
const POLLEN_HIGH = 'High';
const POLLEN_VERYHIGH = 'Very High';
type PollenRisk = typeof POLLEN_LOW | typeof POLLEN_MED | typeof POLLEN_HIGH | typeof POLLEN_VERYHIGH;

export type AmbPollenGeospatial = {
  Count: {
    grass_pollen: number,
    tree_pollen: number,
    weed_pollen: number
  }
  Risk: {
    grass_pollen: PollenRisk,
    tree_pollen: PollenRisk,
    weed_pollen: PollenRisk
  }
}
export type AmbPollenResponse = {
  message: string,
  data: AmbPollenGeospatial[]
}

export type AmbLocation = {
  lat: number,
  lng: number
}

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const AmbClient = (token: string) => {
  const AMB_API = 'https://api.ambeedata.com';
  const httpClient = client.create();
  httpClient.interceptors.request.use(req => {
    req.headers['x-api-key'] = token;
    req.headers['Content-type'] = 'application/json';
    return req;
  });

  return {
    getLatestPollen(location: AmbLocation) {
      return httpClient.get<AmbPollenResponse>(
        `${AMB_API}/latest/pollen/by-lat-lng?lat=${location.lat}&lng=${location.lng}`,
      ).catch(e => {
        logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
        throw new Error('An error occured calling the pollen api');
      });
    },
  };
};
export type AmbClient = typeof AmbClient;
