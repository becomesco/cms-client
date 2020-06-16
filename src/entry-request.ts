import { BCMSEntry, BCMSEntryContent } from './interfaces/entry.interface';
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
  ): Promise<BCMSEntry> {
    const templateAccess = keyAccess.templates.find(e => e._id === templateId);
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
      throw result;
    }
  }
  async getParsed(
    templateId: string,
    id: string,
    keyAccess: KeyAccess,
  ): Promise<any> {
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
      throw result;
    }
  }
  async getAll(templateId: string, keyAccess: KeyAccess): Promise<BCMSEntry[]> {
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
      throw result;
    }
  }
  async getAllParsed(templateId: string, keyAccess: KeyAccess): Promise<any[]> {
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
      throw result;
    }
  }
  async add(
    templateId: string,
    entryContent: BCMSEntryContent[],
    keyAccess: KeyAccess,
  ): Promise<BCMSEntry> {
    const templateAccess = keyAccess.templates.find(e => e._id === templateId);
    if (!templateAccess) {
      throw new Error(
        `Provided API Key is not authorized to access ` +
          `Template "${templateId}".`,
      );
    } else {
      if (!templateAccess.entry.methods.find(e => e === 'POST')) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `POST method in Template "${templateId}".`,
        );
      }
    }
    if (this.useGQL === true) {
      throw new Error('GraphQL is not yet implemented.');
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry`,
        method: 'POST',
        data: {
          content: entryContent,
        },
      });
      if (result.success === true) {
        return result.response.data.entry;
      }
      if (
        result.error.data &&
        result.error.data.response &&
        result.error.data.response.data &&
        result.error.data.response.data.message
      ) {
        throw new Error(result.error.data.response.data.message);
      }
      throw result;
    }
  }
  async update(
    templateId: string,
    id: string,
    entryContent: BCMSEntryContent[],
    keyAccess: KeyAccess,
  ): Promise<BCMSEntry | BCMSAxiosResponse> {
    const templateAccess = keyAccess.templates.find(e => e._id === templateId);
    if (!templateAccess) {
      throw new Error(
        `Provided API Key is not authorized to access ` +
          `Template "${templateId}".`,
      );
    } else {
      if (!templateAccess.entry.methods.find(e => e === 'PUT')) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `POST method in Template "${templateId}".`,
        );
      }
    }
    if (this.useGQL === true) {
      throw new Error('GraphQL is not yet implemented.');
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry`,
        method: 'PUT',
        data: {
          _id: id,
          content: entryContent,
        },
      });
      if (result.success === true) {
        return result.response.data.entry;
      }
      throw result;
    }
  }
  async remove(
    templateId: string,
    id: string,
    keyAccess: KeyAccess,
  ): Promise<boolean | BCMSAxiosResponse> {
    const templateAccess = keyAccess.templates.find(e => e._id === templateId);
    if (!templateAccess) {
      throw new Error(
        `Provided API Key is not authorized to access ` +
          `Template "${templateId}".`,
      );
    } else {
      if (!templateAccess.entry.methods.find(e => e === 'PUT')) {
        throw new Error(
          `Provided API Key is not authorized to access ` +
            `POST method in Template "${templateId}".`,
        );
      }
    }
    if (this.useGQL === true) {
      throw new Error('GraphQL is not yet implemented.');
    } else {
      const result = await this.axios.send({
        url: `/template/${templateId}/entry/${id}`,
        method: 'DELETE',
      });
      if (result.success === true) {
        return result.response.data.message;
      }
      throw result;
    }
  }
}
