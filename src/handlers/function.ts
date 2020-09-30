import { FunctionResponse, GetApiKeyAccess, Send } from '../types';

export interface BCMSFunctionHandlerPrototype {
  call<T>(name: string, body?: any): Promise<FunctionResponse<T>>;
}

function bcmsFunctionHandler(
  getKeyAccess: GetApiKeyAccess,
  send: Send,
): BCMSFunctionHandlerPrototype {
  return {
    async call<T>(name: string, body?: any): Promise<FunctionResponse<T>> {
      const keyAccess = await getKeyAccess();
      const access = keyAccess.functions.find((e) => e.name === name);
      if (!access) {
        throw Error(`Key is not allowed to call function "${name}".`);
      }
      return await send({
        url: `/function/${name}`,
        method: 'POST',
        data: body,
      });
    },
  };
}

export const BCMSFunctionHandler = bcmsFunctionHandler;
