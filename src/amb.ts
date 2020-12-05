/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/indent */
import client from 'axios';

export type AmbPollenGeospatial = {
    Count: {
        grass_pollen: number,
        tree_pollen: number,
        weed_pollen: number
    }
    Risk: {
        grass_pollen: number,
        tree_pollen: number,
        weed_pollen: number
    }
}
export type AmbPollenResponse = {
    message: string,
    data: AmbPollenGeospatial[]
}

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const AmbClient = (token: string) => {
    const AMB_API = 'https://api.ambeedata.com';
    const httpClient = client.create();
    httpClient.interceptors.request.use(req => {
        req.headers['x-api-key'] = token;
        return req;
    });

    return {
        getLatestPollen(location: { lat: number, lng: number }) {
            return httpClient.get<AmbPollenResponse>(
                `${AMB_API}/latest/by-lat-lng&lat=${location.lat},lng=${location.lng}`,
            );
        },
    };
};
