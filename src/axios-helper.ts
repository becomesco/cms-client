import axios from 'axios';
import { BCMSSecurity } from './security';
import {
  BCMSAxios,
  BCMSAxiosConfig,
  BCMSAxiosResponse,
  BCMSAxiosSetup,
} from './interfaces/axios.interface';
import { Key } from './interfaces/key';

export class AxiosHelper {
  public static instance(cmsURL: string, key: Key): BCMSAxios {
    const setup: BCMSAxiosSetup = {
      baseURL: cmsURL,
      defaultHeaders: [],
      defaultQueries: [],
      preRequestFunction: async (
        config: BCMSAxiosConfig,
      ): Promise<BCMSAxiosConfig> => {
        const signature = BCMSSecurity.sign(
          key,
          typeof config.data === 'undefined' ? {} : config.data,
        );
        if (!config.queries) {
          config.queries = {
            key: signature.key,
            timestamp: signature.timestamp,
            nonce: signature.nonce,
            signature: signature.signature,
          };
        } else {
          config.queries.key = signature.key;
          config.queries.timestamp = signature.timestamp;
          config.queries.nonce = signature.nonce;
          config.queries.signature = signature.signature;
        }
        return config;
      },
    };
    return {
      send: async (config: BCMSAxiosConfig): Promise<BCMSAxiosResponse> => {
        let data;
        if (config.data && typeof config.data === 'object') {
          data = config.data;
          if (config.headers) {
            config.headers['Content-Type'] = 'application/json';
          } else {
            config.headers = {
              'Content-Type': 'application/json',
            };
          }
        }
        try {
          config = await setup.preRequestFunction(config);
        } catch (error) {
          return {
            success: false,
            error: {
              status: -1,
              message: error.message,
              data: error,
            },
          };
        }
        const check = AxiosHelper.checkInput(config);
        if (check !== 'good') {
          return {
            success: false,
            error: {
              status: -1,
              message: check,
              data: new Error(check),
            },
          };
        }
        if (config.queries) {
          const buffer = [];
          for (const i in config.queries) {
            buffer.push(`${i}=${config.queries[i]}`);
          }
          if (setup.defaultQueries) {
            for (const i in setup.defaultQueries) {
              buffer.push(
                `${setup.defaultQueries[i].key}=${setup.defaultQueries[i].value}`,
              );
            }
          }
          config.url += `?${buffer.join('&')}`;
        }
        try {
          const response = await axios({
            method: config.method,
            url: setup.baseURL + config.url,
            headers: config.headers,
            responseType: config.responseType,
            data,
          });
          return {
            success: true,
            response,
          };
        } catch (error) {
          return {
            success: false,
            error: {
              status: -1,
              message: `Failed to send a request to: "${setup.baseURL +
                config.url}"`,
              data: error,
            },
          };
        }
      },
    };
  }

  private static checkInput(config: BCMSAxiosConfig): string {
    if (!config) {
      return '"config" parameter was not provided.';
    }
    if (!config.url || typeof config.url !== 'string') {
      return 'Missing property "url: string"';
    }
    if (!config.method || typeof config.method !== 'string') {
      return 'Missing property "method: string"';
    }
    return 'good';
  }
}
