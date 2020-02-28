# Becomes CMS client library

This library was written to enable easy connectivity with [Becomes CMS](https://github.com/becomes/cms).

[![npm](https://nodei.co/npm/@becomes/cms-client.png)](https://www.npmjs.com/package/@becomes/cms-client)

## How to use

1. Install package from NPM: `npm i --save @becomes/cms-client`
2. Create new Client instance and make a request to CMS:

```ts
// Import Client class.
import { BCMSClient } from '@becomes/cms-client';

async function main() {
  // Create new instance of a Client.
  const client = new BCMSClient(
    process.env.API_ORIGIN,
    {
      id: process.env.API_KEY,
      secret: process.env.API_SECRET,
    },
    false,
  );
  // Get all parsed Entries in specified Template.
  const query = await client
    .template('__TEMPLATE_ID__')
    .entry()
    .getAllParsed();
  // Print query result
  console.log(query);
}
```

## API

> Get Template

```ts
const query = await client.template('__TEMPLATE_ID__').get();
```

> Get Entry

```ts
const query = await client
  .template('__TEMPLATE_ID__')
  .entry('__ENTRY_ID__')
  .get();
```

> Get parsed Entry

```ts
const query = await client
  .template('__TEMPLATE_ID__')
  .entry('__ENTRY_ID__')
  .getParsed();
```

> Get all Entries

```ts
const query = await client
  .template('__TEMPLATE_ID__')
  .entry()
  .getAll();
```

> Get all parsed Entries

```ts
const query = await client
  .template('__TEMPLATE_ID__')
  .entry()
  .getAllParsed();
```

## Gatsby Example