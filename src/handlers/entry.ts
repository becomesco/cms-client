import { Entry, GetApiKeyAccess, Send } from '../types';

export interface BCMSEntryHandlerPrototype {
  getAll(templateId: string, parse?: boolean): Promise<Entry[]>;
  get(data: {
    templateId: string;
    entryId: string;
    parse?: boolean;
  }): Promise<Entry>;
}

function bcmsEntryHandler(
  getKeyAccess: GetApiKeyAccess,
  send: Send,
): BCMSEntryHandlerPrototype {
  return {
    async getAll(templateId, parse) {
      const keyAccess = await getKeyAccess();
      const access = keyAccess.templates.find((e) => e._id === templateId);
      if (!access || !access.get) {
        throw Error(`Key is not allowed to get entries in this template.`);
      }
      const result: {
        entries: Entry[];
      } = await send({
        url: `/entry/all/${templateId}${parse ? '/parse' : ''}`,
        method: 'GET',
      });
      return result.entries;
    },
    async get(data) {
      const keyAccess = await getKeyAccess();
      const access = keyAccess.templates.find((e) => e._id === data.templateId);
      if (!access || !access.get) {
        throw Error(`Key is not allowed to get entries in this template.`);
      }
      const result: {
        entry: Entry;
      } = await send({
        url: `/entry/${data.templateId}/${data.entryId}${
          data.parse ? '/parse' : ''
        }`,
        method: 'GET',
      });
      return result.entry;
    },
  };
}

export const BCMSEntryHandler = bcmsEntryHandler;
