import { BCMSTemplate } from './interfaces/template.interface';
import { BCMSEntryRequest } from './entry-request';
import { Key } from './interfaces/key';
import { BCMSAxios, BCMSAxiosResponse } from './interfaces/axios.interface';
import { AxiosHelper } from './axios-helper';

export class BCMSTemplateRequest {
  private readonly axios?: BCMSAxios;

  constructor(
    cmsURL: string,
    key: Key,
    private readonly useGQL: boolean,
    public readonly entry: BCMSEntryRequest,
  ) {
    if (useGQL !== true) {
      this.axios = AxiosHelper.instance(cmsURL, key);
    }
  }
  async get(id: string): Promise<BCMSTemplate | BCMSAxiosResponse> {
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: `/template/${id}`,
        method: 'GET',
      });
      if (result.success === true) {
        return result.response.data.template;
      }
      return result;
    }
  }
}
