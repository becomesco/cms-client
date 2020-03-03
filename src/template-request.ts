import { BCMSTemplate } from './interfaces/template.interface';
import { BCMSEntryRequest } from './entry-request';
import { Key, KeyAccess } from './interfaces/key';
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

  async get(
    id: string,
    keyAccess: KeyAccess,
  ): Promise<BCMSTemplate> {
    if (keyAccess) {
      const templateAccess = keyAccess.templates.find(e => e._id === id);
      if (!templateAccess || !templateAccess.methods.find(e => e === 'GET')) {
        throw new Error(
          `Provided API Key is not authorized to access Template "${id}".`,
        );
      }
    }
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
      throw result;
    }
  }
}
