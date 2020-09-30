import { Entry, GetApiKeyAccess, Send } from '../types';

export interface BCMSEntryHandlerPrototype {
  getAll(templateId: string): Promise<Entry[]>;
  get(data: { templateId: string; entryId: string }): Promise<Entry>;
}

function bcmsEntryHandler(
  getKeyAccess: GetApiKeyAccess,
  send: Send,
): BCMSEntryHandlerPrototype {
  return {
    async getAll(templateId) {
      const keyAccess = await getKeyAccess();
      const access = keyAccess.templates.find((e) => e._id === templateId);
      if (!access || !access.get) {
        throw Error(`Key is not allowed to get entries in this template.`);
      }
      const result: {
        entries: Entry[];
      } = await send({
        url: `/entry/all/${templateId}`,
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
        url: `/entry/${data.templateId}/${data.entryId}`,
        method: 'GET',
      });
      return result.entry;
    },
  };
}

export const BCMSEntryHandler = bcmsEntryHandler;
