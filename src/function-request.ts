import { BCMSAxios, Key, KeyAccess, BCMSAxiosResponse } from './interfaces';
import { AxiosHelper } from './axios-helper';

export class BCMSFunctionRequest {
  private readonly axios?: BCMSAxios;

  constructor(cmsURL: string, key: Key, private readonly useGQL: boolean) {
    if (useGQL !== true) {
      this.axios = AxiosHelper.instance(cmsURL, key);
    }
  }

  async execute(name: string, keyAccess: KeyAccess, data?: any): Promise<any> {
    if (keyAccess) {
      if (!keyAccess.functions.find(e => e.name === name)) {
        throw new Error(
          `Provided API Key is not authorized to access Function "${name}".`,
        );
      }
    }
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: `/function/${name}`,
        method: 'POST',
        data,
      });
      if (result.success === true) {
        return result.response.data.result;
      }
      throw result;
    }
  }
}
