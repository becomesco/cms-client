import { KeyValue } from './key-value.interface';
import { Method, AxiosResponse, ResponseType } from 'axios';

export interface BCMSAxiosConfig {
  url: string;
  method: Method;
  headers?: any;
  queries?: any;
  responseType?: ResponseType;
  data?: any;
}

export interface BCMSAxiosSetup {
  baseURL?: string;
  defaultHeaders?: KeyValue[];
  defaultQueries?: KeyValue[];
  preRequestFunction?: (config: BCMSAxiosConfig) => Promise<BCMSAxiosConfig>;
}

export interface BCMSAxiosResponse {
  success: boolean;
  error?: {
    status: number;
    message: string;
    data: any;
  };
  response?: AxiosResponse;
}

export interface BCMSAxios {
  send: (config: BCMSAxiosConfig) => Promise<BCMSAxiosResponse>;
}
