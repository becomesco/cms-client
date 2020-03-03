import { BCMSAxios, Key, BCMSMedia, BCMSAxiosResponse } from './interfaces';
import { AxiosHelper } from './axios-helper';

export class BCMSMediaRequest {
  private readonly axios: BCMSAxios;
  constructor(cmsURL: string, key: Key, private readonly useGQL: boolean) {
    if (useGQL !== true) {
      this.axios = AxiosHelper.instance(cmsURL, key);
    }
  }

  async getAll(): Promise<BCMSMedia[]> {
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: '/media/all',
        method: 'GET',
      });
      if (result.success === true) {
        return result.response.data.media;
      }
      throw result;
    }
  }

  async get(path: string): Promise<BCMSMedia> {
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: '/media/file/index',
        method: 'GET',
        queries: {
          path,
        },
      });
      if (result.success === true) {
        return result.response.data.media;
      }
      throw result;
    }
  }
  async getBin(path): Promise<Buffer> {
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: '/media/file',
        method: 'GET',
        queries: {
          path,
        },
        responseType: 'arraybuffer',
      });
      if (result.success === true) {
        return result.response.data;
      }
      throw result;
    }
  }
}
