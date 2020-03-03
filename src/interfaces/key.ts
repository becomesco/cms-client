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

/**
 * Set of allowed values for request method.
 */
export enum KeyMethod {
  GET_ALL = 'GET_ALL',
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
}

/**
 * Defines what specific Key can do with Template/Templates.
 */
export interface KeyAccess {
  /** Refers to all Templates */
  global: {
    methods: KeyMethod[];
  };
  templates: Array<{
    /** Specific Template ID. */
    _id: string;
    /** Methods that can be executed on specified Template. */
    methods: KeyMethod[];
    /** Entry level access definition for specified Template. */
    entry: {
      methods: KeyMethod[];
    };
  }>;
  functions: Array<{
    name: string;
  }>;
}
