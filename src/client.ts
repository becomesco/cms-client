import { Key, KeyAccess } from './interfaces/key';
import { BCMSTemplateRequest } from './template-request';
import { BCMSEntryRequest } from './entry-request';
import { BCMSEntry } from './interfaces/entry.interface';
import { BCMSMediaRequest } from './media-request';
import { BCMSAxiosResponse, BCMSMedia } from './interfaces';
import { AxiosHelper } from './axios-helper';
import { BCMSFunctionRequest } from './function-request';

export class BCMSClient {
  private readonly bcmsTemplate: BCMSTemplateRequest;
  private readonly mediaRequest: BCMSMediaRequest;
  private readonly functionRequest: BCMSFunctionRequest;
  private constructor(
    cmsURL: string,
    key: Key,
    useGQL: boolean,
    private readonly keyAccess: KeyAccess,
  ) {
    this.bcmsTemplate = new BCMSTemplateRequest(
      cmsURL,
      key,
      useGQL,
      new BCMSEntryRequest(cmsURL, key, useGQL),
    );
    this.mediaRequest = new BCMSMediaRequest(cmsURL, key, useGQL);
    this.functionRequest = new BCMSFunctionRequest(cmsURL, key, useGQL);
  }

  public static async instance(
    cmsURL: string,
    key: Key,
    useGQL: boolean,
  ): Promise<BCMSClient> {
    if (useGQL !== true) {
      const axios = AxiosHelper.instance(cmsURL, key);
      const query = await axios.send({
        url: '/key/access/list',
        method: 'GET',
      });
      if (query.success === false) {
        throw query.error;
      }
      const keyAccess = query.response.data.access;
      return new BCMSClient(cmsURL, key, useGQL, keyAccess);
    }
  }

  public template(id: string) {
    return {
      get: async () => {
        return await this.bcmsTemplate.get(id, this.keyAccess);
      },
      entry: (entryId?: string) => {
        return {
          get: async () => {
            if (typeof entryId !== 'string') {
              throw new Error('"entryId" is required');
            }
            return await this.bcmsTemplate.entry.get(
              id,
              entryId,
              this.keyAccess,
            );
          },
          getParsed: async () => {
            if (typeof entryId !== 'string') {
              throw new Error('"entryId" is required');
            }
            return await this.bcmsTemplate.entry.getParsed(
              id,
              entryId,
              this.keyAccess,
            );
          },
          getAll: async () => {
            return await this.bcmsTemplate.entry.getAll(id, this.keyAccess);
          },
          getAllParsed: async () => {
            return await this.bcmsTemplate.entry.getAllParsed(
              id,
              this.keyAccess,
            );
          },
          add: async (entry: BCMSEntry) => {
            return await this.bcmsTemplate.entry.add(id, entry);
          },
          update: async (entry: BCMSEntry) => {
            return await this.bcmsTemplate.entry.update(id, entry);
          },
          remove: async () => {
            if (typeof entryId !== 'string') {
              throw new Error('"entryId" is required');
            }
            return await this.bcmsTemplate.entry.remove(id, entryId);
          },
        };
      },
    };
  }

  public media = {
    all: async (): Promise<
      | BCMSAxiosResponse
      | Array<{
          file: BCMSMedia;
          bin: () => Promise<BCMSAxiosResponse | Buffer>;
        }>
    > => {
      const files = await this.mediaRequest.getAll();
      if ((files as BCMSAxiosResponse).success === false) {
        return files as BCMSAxiosResponse;
      }
      return (files as BCMSMedia[]).map(file => {
        return {
          file,
          bin: async () => {
            if (file.type === 'DIR') {
              throw new Error(`File "${file.path}" is a directory.`);
            }
            return await this.mediaRequest.getBin(`${file.path}/${file.name}`);
          },
        };
      });
    },
    get: async (
      path: string,
    ): Promise<
      | BCMSAxiosResponse
      | {
          file: BCMSMedia;
          bin: () => Promise<BCMSAxiosResponse | Buffer>;
        }
    > => {
      const file = await this.mediaRequest.get(path);

      if ((file as BCMSAxiosResponse).success === false) {
        return file as BCMSAxiosResponse;
      }
      return {
        file: file as BCMSMedia,
        bin: async () => {
          return await this.mediaRequest.getBin(path);
        },
      };
    },
  };

  public async fn(name: string, data?: any) {
    return await this.functionRequest.execute(name, this.keyAccess, data);
  }
}
