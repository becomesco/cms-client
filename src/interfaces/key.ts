export interface Key {
  id: string;
  secret: string;
}

export interface KeySignature {
  key: string;
  timestamp: number;
  nonce: string;
  signature: string;
}
