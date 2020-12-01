import { AxiosResponse } from 'axios';
import { AmbPollenGeospatial } from './amb';

const ambPollenToSlack = (pollen: Promise<AxiosResponse<AmbPollenGeospatial>>) => pollen.then(pol => {

});
