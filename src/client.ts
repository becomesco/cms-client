import { Key, KeyAccess } from './interfaces/key';
import { BCMSTemplateRequest } from './template-request';
import { BCMSEntryRequest } from './entry-request';
import { BCMSEntry, BCMSEntryContent } from './interfaces/entry.interface';
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
          add: async (entryContent: BCMSEntryContent[]) => {
            return await this.bcmsTemplate.entry.add(
              id,
              entryContent,
              this.keyAccess,
            );
          },
          update: async (entryContent: BCMSEntryContent[]) => {
            return await this.bcmsTemplate.entry.update(
              id,
              entryId,
              entryContent,
              this.keyAccess,
            );
          },
          remove: async () => {
            if (typeof entryId !== 'string') {
              throw new Error('"entryId" is required');
            }
            return await this.bcmsTemplate.entry.remove(
              id,
              entryId,
              this.keyAccess,
            );
          },
        };
      },
    };
  }

  public media = {
    all: async (): Promise<
      Array<{
        file: BCMSMedia;
        bin: () => Promise<Buffer>;
      }>
    > => {
      const files = await this.mediaRequest.getAll();
      return files.map(file => {
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
    ): Promise<{
      file: BCMSMedia;
      bin: () => Promise<Buffer>;
    }> => {
      const file = await this.mediaRequest.get(path);
      return {
        file,
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
