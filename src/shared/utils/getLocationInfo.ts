import { request } from 'express';
import api from './apiInstance';

interface IRequest {
  latitude: number;
  longitude: number;
}

interface IResponse {
  city: string | undefined;
  state: string | undefined;
}

export default async function getLocationInfo({
  latitude,
  longitude,
}: IRequest): Promise<IResponse> {
  try {
    const urlRequest = `${process.env.OPEN_CAGE_URL}`;

    const response = await api.get(urlRequest, {
      params: {
        key: process.env.OPEN_CAGE_KEY,
        q: `${latitude},${longitude}`,
        pretty: 1,
        no_annotations: 1,
      },
    });

    console.log(urlRequest);
    console.log(response.data.results);

    const { town, state } = response.data.results.components;

    console.log(town, state);

    return {
      city: town,
      state,
    };
  } catch (err) {
    return {
      city: undefined,
      state: undefined,
    };
  }
}
