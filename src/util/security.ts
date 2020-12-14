import * as crypto from 'crypto-js';
import { ApiKey, ApiKeySignature } from '../types';

export interface SecurityPrototype {
  sign(payload: any): ApiKeySignature;
}

function security(key: ApiKey): SecurityPrototype {
  return {
    sign(payload: any) {
      const data = {
        key: key.id,
        timestamp: Date.now(),
        nonce: crypto.lib.WordArray.random(3).toString(),
        signature: '',
      };
      let payloadAsString = '';
      if (typeof payload === 'object') {
        if (
          typeof window !== 'undefined' &&
          typeof window.btoa !== 'undefined'
        ) {
          payloadAsString = window.btoa(
            encodeURIComponent(JSON.stringify(payload)),
          );
          // payloadAsString = window.btoa(JSON.stringify(payload));
        } else {
          payloadAsString = Buffer.from(
            encodeURIComponent(JSON.stringify(payload)),
          ).toString('base64');
        }
      } else {
        payloadAsString = '' + payload;
      }
      data.signature = crypto
        .HmacSHA256(
          data.nonce + data.timestamp + key.id + payloadAsString,
          key.secret,
        )
        .toString();
      return data;
    },
  };
}

export const Security = security;
