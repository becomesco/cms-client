import { Key } from './interfaces/key';
import { BCMSTemplateRequest } from './template-request';
import { BCMSEntryRequest } from './entry-request';
import { BCMSEntry } from './interfaces/entry.interface';

export class BCMSClient {
  private readonly bcmsTemplate: BCMSTemplateRequest;
  constructor(cmsURL: string, key: Key, useGQL: boolean) {
    this.bcmsTemplate = new BCMSTemplateRequest(
      cmsURL,
      key,
      useGQL,
      new BCMSEntryRequest(cmsURL, key, useGQL),
    );
  }

  public template(id: string) {
    return {
      get: async () => {
        return await this.bcmsTemplate.get(id);
      },
      entry: (entryId?: string) => {
        return {
          get: async () => {
            if (typeof entryId !== 'string') {
              throw new Error('"entryId" is required');
            }
            return await this.bcmsTemplate.entry.get(id, entryId);
          },
          getParsed: async () => {
            if (typeof entryId !== 'string') {
              throw new Error('"entryId" is required');
            }
            return await this.bcmsTemplate.entry.getParsed(id, entryId);
          },
          getAll: async () => {
            return await this.bcmsTemplate.entry.getAll(id);
          },
          getAllParsed: async () => {
            return await this.bcmsTemplate.entry.getAllParsed(id);
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
}
