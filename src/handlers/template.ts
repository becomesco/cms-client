import { GetApiKeyAccess, Send, Template } from '../types';

export interface BCMSTemplateHandlerPrototype {
  get(id: string): Promise<Template>;
}

function bcmsTemplateHandler(
  getKeyAccess: GetApiKeyAccess,
  send: Send,
): BCMSTemplateHandlerPrototype {
  return {
    async get(id) {
      const keyAccess = await getKeyAccess();
      const access = keyAccess.templates.find((e) => e._id === id);
      if (!access || !access.get) {
        throw Error(`Key does not have permission to access "${id}" template.`);
      }
      const result: {
        template: Template;
      } = await send({
        url: `/template/${id}`,
        method: 'GET',
      });
      return result.template;
    },
  };
}

export const BCMSTemplateHandler = bcmsTemplateHandler;
