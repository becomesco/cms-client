import { ErrorObject } from '../types';

export interface ErrorWrapperPrototype {
  exec<T>(fn: () => Promise<T>): Promise<T>;
}

function errorWrapper(): ErrorWrapperPrototype {
  return {
    async exec<T>(fn: () => Promise<T>): Promise<T> {
      try {
        return await fn();
      } catch (error) {
        // console.error(error);
        // return;
        const errorObject: ErrorObject = {};
        if (error && error.response) {
          errorObject.network = {
            url:
              error.response.config && error.response.config.url
                ? error.response.config.url
                : 'unknown',
            status: error.response.status ? error.response.status : -1,
            msg:
              error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message,
            err: error.message,
          };
        } else {
          errorObject.generic = error;
        }
        throw Error(JSON.stringify(errorObject, null, '  '));
      }
    },
  };
}

export const ErrorWrapper = errorWrapper();
