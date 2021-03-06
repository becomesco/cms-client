import SocketIO, {Socket} from 'socket.io-client';
import { SocketEventData, SocketEventName } from '../types';
import * as uuid from 'uuid';
import { SecurityPrototype } from '../util';

export interface BCMSSocketHandlerPrototype {
  connect(server: { url: string; path: string }): Promise<void>;
  subscribe(
    handler: (event: SocketEventName, data: SocketEventData) => void,
  ): () => void;
}

export function BCMSSocketHandler(security: SecurityPrototype) {
  let isConnected = false;
  let socket: Socket;
  const handlers: Array<{
    id: string;
    handler(event: SocketEventName, data: SocketEventData): void;
  }> = [];
  const self: BCMSSocketHandlerPrototype = {
    async connect(server) {
      if (isConnected === false) {
        isConnected = true;
        return await new Promise<void>((resolve, reject) => {
          try {
            const signature = security.sign({});
            socket = SocketIO(server.url, {
              path: server.path,
              query: {
                timestamp: '' + signature.timestamp,
                signature: signature.signature,
                key: signature.key,
                nonce: signature.nonce,
              },
              autoConnect: false,
            });
            socket.connect();
            socket.on('connect_error', (...data: any) => {
              socket.close();
              reject(data);
            });
            socket.on('error', (data: any) => {
              console.error('Error', data);
              socket.close();
              reject(data);
            });
            socket.on('connect', () => {
              // tslint:disable-next-line: no-console
              console.log('Successfully connected to Socket server.');
              isConnected = true;
              resolve();
            });
            socket.on('disconnect', () => {
              isConnected = false;
              // tslint:disable-next-line: no-console
              console.log('Disconnected from Socket server.');
            });
            Object.keys(SocketEventName).forEach((eventName) => {
              socket.on(SocketEventName[eventName], (data) => {
                handlers.forEach((handler) => {
                  handler.handler(SocketEventName[eventName], data);
                });
              });
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    },
    subscribe(handler) {
      const id = uuid.v4();
      handlers.push({
        id,
        handler,
      });
      return () => {
        for (let i = 0; i < handlers.length; i++) {
          if (handlers[i].id === id) {
            handlers.splice(i, 1);
            return;
          }
        }
      };
    },
  };
  return self;
}
