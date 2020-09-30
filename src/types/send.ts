import { AxiosRequestConfig } from 'axios';

export type Send = <T>(config: AxiosRequestConfig, auth?: boolean) => Promise<T>;
