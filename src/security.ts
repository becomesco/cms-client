import * as crypto from 'crypto-js';
import { Key, KeySignature } from './interfaces/key';

export class BCMSSecurity {
  public static sign(key: Key, payload: any): KeySignature {
    const data = {
      key: key.id,
      timestamp: Date.now(),
      nonce: crypto.lib.WordArray.random(3).toString(),
      signature: '',
    };
    let payloadAsString = '';
    if (typeof payload === 'object') {
      if (typeof window !== 'undefined' && typeof window.btoa !== 'undefined') {
        payloadAsString = window.btoa(JSON.stringify(payload));
      } else {
        payloadAsString = Buffer.from(JSON.stringify(payload)).toString(
          'base64',
        );
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
  }
}
