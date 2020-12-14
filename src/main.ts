import {
  BCMSEntryHandler,
  BCMSFunctionHandler,
  BCMSMediaHandler,
  BCMSSocketHandler,
  BCMSTemplateHandler,
} from './handlers';
import { ApiKey, ApiKeyAccess, ApiKeySignature } from './types';
import { HandlerManager } from './types';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorWrapper, Security } from './util';

export interface BCMSClientPrototype extends HandlerManager {
  keyAccess(): Promise<ApiKeyAccess>;
}

function bcmsClient(config: {
  cmsOrigin: string;
  key: ApiKey;
}): BCMSClientPrototype {
  let keyAccess: ApiKeyAccess;
  const security = Security(config.key);
  async function send<T>(
    conf: AxiosRequestConfig,
    doNotAuth?: boolean,
  ): Promise<T> {
    if (conf.data && typeof conf.data === 'object') {
      if (conf.headers) {
        conf.headers['Content-Type'] = 'application/json';
      } else {
        conf.headers = {
          'Content-Type': 'application/json',
        };
      }
    }
    let signature: ApiKeySignature;
    if (!doNotAuth) {
      const signatureResult = await ErrorWrapper.exec<ApiKeySignature>(
        async () => {
          return security.sign(
            typeof conf.data === 'undefined' ? {} : conf.data,
          );
        },
      );
      if (!signatureResult) {
        return;
      }
      signature = signatureResult;
    }
    conf.url = `${config.cmsOrigin}/api${conf.url}`;
    if (signature) {
      conf.url +=
        '?key=' +
        signature.key +
        '&timestamp=' +
        signature.timestamp +
        '&nonce=' +
        signature.nonce +
        '&signature=' +
        signature.signature;
    }
    const response = await ErrorWrapper.exec<AxiosResponse>(async () => {
      return await Axios({
        url: conf.url,
        method: conf.method,
        headers: conf.headers,
        responseType: conf.responseType,
        data: conf.data,
      });
    });
    if (!response) {
      return;
    }
    return response.data;
  }
  async function getKeyAccess(): Promise<ApiKeyAccess> {
    if (!keyAccess) {
      const result: {
        access: ApiKeyAccess;
      } = await send({
        url: `/key/access/list`,
        method: 'GET',
      });
      keyAccess = result.access;
    }
    return JSON.parse(JSON.stringify(keyAccess));
  }
  const handlerManger: HandlerManager = {
    template: BCMSTemplateHandler(getKeyAccess, send),
    entry: BCMSEntryHandler(getKeyAccess, send),
    media: BCMSMediaHandler(send),
    function: BCMSFunctionHandler(getKeyAccess, send),
    socket: BCMSSocketHandler(security),
  };
  return {
    ...handlerManger,
    keyAccess() {
      return getKeyAccess();
    },
  };
}

export const BCMSClient = bcmsClient;
