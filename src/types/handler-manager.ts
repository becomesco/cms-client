import {
  BCMSEntryHandlerPrototype,
  BCMSFunctionHandlerPrototype,
  BCMSMediaHandlerPrototype,
  BCMSTemplateHandlerPrototype,
} from '../handlers';

export interface HandlerManager {
  template: BCMSTemplateHandlerPrototype;
  entry: BCMSEntryHandlerPrototype;
  media: BCMSMediaHandlerPrototype;
  function: BCMSFunctionHandlerPrototype;
}
