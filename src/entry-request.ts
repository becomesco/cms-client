import { BCMSEntry } from './interfaces/entry.interface';
import { Key, KeyAccess } from './interfaces/key';
import { BCMSAxios, BCMSAxiosResponse } from './interfaces/axios.interface';
import { AxiosHelper } from './axios-helper';

export class BCMSEntryRequest {
  private readonly axios: BCMSAxios;
  constructor(cmsURL: string, key: Key, private readonly useGQL: boolean) {
    if (useGQL !== true) {
      this.axios = AxiosHelper.instance(cmsURL, key);
    }
  }
  async get(
    templateId: string,
    id: string,
    keyAccess: KeyAccess,
  ): Promise<BCMSEntry | BCMSAxiosResponse> {
    if (keyAccess) {
      const templateAccess = keyAccess.templates.find(
        e => e._id === templateId,
      );
      if (!templateAccess) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `Template "${templateId}".`,
        );
      } else {
        if (!templateAccess.entry.methods.find(e => e === 'GET')) {
          throw new Error(
            `Provided API Key is not authorized to access ` +
              `Entry "${id}" in Template "${templateId}".`,
          );
        }
      }
    }
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry/${id}`,
        method: 'GET',
      });
      if (result.success === true) {
        return result.response.data.entry;
      }
      return result;
    }
  }
  async getParsed(
    templateId: string,
    id: string,
    keyAccess: KeyAccess,
  ): Promise<any | BCMSAxiosResponse> {
    if (keyAccess) {
      const templateAccess = keyAccess.templates.find(
        e => e._id === templateId,
      );
      if (!templateAccess) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `Template "${templateId}".`,
        );
      } else {
        if (!templateAccess.entry.methods.find(e => e === 'GET')) {
          throw new Error(
            `Provided API Key is not authorized to access ` +
              `Entry "${id}" in Template "${templateId}".`,
          );
        }
      }
    }
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry/${id}/compile`,
        method: 'GET',
      });
      if (result.success === true) {
        return result.response.data.entry;
      }
      return result;
    }
  }
  async getAll(
    templateId: string,
    keyAccess: KeyAccess,
  ): Promise<BCMSEntry[] | BCMSAxiosResponse> {
    if (keyAccess) {
      const templateAccess = keyAccess.templates.find(
        e => e._id === templateId,
      );
      if (!templateAccess) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `Template "${templateId}".`,
        );
      } else {
        if (!templateAccess.entry.methods.find(e => e === 'GET')) {
          throw new Error(
            `Provided API Key is not authorized to access ` +
              `GET_ALL Entries method in Template "${templateId}".`,
          );
        }
      }
    }
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry/all`,
        method: 'GET',
      });
      if (result.success === true) {
        return result.response.data.entries;
      }
      return result;
    }
  }
  async getAllParsed(
    templateId: string,
    keyAccess: KeyAccess,
  ): Promise<any | BCMSAxiosResponse> {
    if (keyAccess) {
      const templateAccess = keyAccess.templates.find(
        e => e._id === templateId,
      );
      if (!templateAccess) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `Template "${templateId}".`,
        );
      } else {
        if (!templateAccess.entry.methods.find(e => e === 'GET')) {
          throw new Error(
            `Provided API Key is not authorized to access ` +
              `GET_ALL Entries method in Template "${templateId}".`,
          );
        }
      }
    }
    if (this.useGQL === true) {
      return;
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry/all/compile`,
        method: 'GET',
      });
      if (result.success === true) {
        return result.response.data.entries;
      }
      return result;
    }
  }
  async add(
    templateId: string,
    entry: BCMSEntry,
  ): Promise<BCMSEntry | BCMSAxiosResponse> {
    // TODO: Implement and test add method
    return;
  }
  async update(
    templateId: string,
    entry: BCMSEntry,
  ): Promise<BCMSEntry | BCMSAxiosResponse> {
    // TODO: Implement and test update method
    return;
  }
  async remove(
    templateId: string,
    id: string,
  ): Promise<boolean | BCMSAxiosResponse> {
    // TODO: Implement and test delete method
    return;
  }
}
