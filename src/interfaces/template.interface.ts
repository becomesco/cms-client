import { Prop } from '../prop';

export enum BCMSTemplateType {
  RICH_CONTENT = 'RICH_CONTENT',
  DATA_MODEL = 'DATA_MODEL',
}

export interface BCMSTemplate {
  _id: string;
  createdAt: number;
  updatedAt: number;
  type: BCMSTemplateType;
  name: string;
  desc: string;
  userId: string;
  entryTemplate: Prop[];
  entryIds: string[];
}
