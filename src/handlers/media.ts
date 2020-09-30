import { Media, MediaResponse, Send } from '../types';

export interface BCMSMediaHandlerPrototype {
  getAll(): Promise<MediaResponse[]>;
  get(id: string): Promise<MediaResponse>;
}

function bcmsMediaHandler(send: Send): BCMSMediaHandlerPrototype {
  function binFunction(media: Media) {
    return async () => {
      const binResult: ArrayBuffer = await send({
        url: `/media/${media._id}/bin`,
        method: 'GET',
        responseType: 'arraybuffer',
      });
      return binResult;
    };
  }
  return {
    async getAll() {
      const result: {
        media: Media[];
      } = await send({
        url: `/media/all`,
        method: 'GET',
      });
      return result.media.map((media) => {
        return {
          data: media,
          bin: binFunction(media),
        };
      });
    },
    async get(id) {
      const result: {
        media: Media;
      } = await send({
        url: `/media/${id}`,
        method: 'GET',
      });
      return {
        data: result.media,
        bin: binFunction(result.media),
      };
    },
  };
}

export const BCMSMediaHandler = bcmsMediaHandler;
