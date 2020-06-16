import { Prop } from '../prop';

export interface BCMSEntryContent {
  lng: string;
  props: Prop[];
}

export interface BCMSEntry {
  _id: string;
  createdAt: string;
  updateAt: string;
  templateId: string;
  userId: string;
  content: BCMSEntryContent[];
}
