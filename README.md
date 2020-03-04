# Becomes CMS client library

This library was written to enable easy connectivity with [Becomes CMS](https://github.com/becomesco/cms).

[![Build Status](https://travis-ci.org/becomesco/cms-client.svg?branch=dev)](https://travis-ci.org/becomesco/cms-client)

[![npm](https://nodei.co/npm/@becomes/cms-client.png)](https://www.npmjs.com/package/@becomes/cms-client)

## How to use

1. Install package from NPM: `npm i --save @becomes/cms-client`
2. Create new Client instance and make a request to CMS:

```ts
// Import Client class.
import { BCMSClient } from '@becomes/cms-client';

async function main() {
  // Create new instance of a Client.
  const client = await BCMSClient.instance(
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

> Get all Media

```ts
const query = await client.media.all();
```

> Get Media

```ts
const query = await client.media.get('/path/to/file');
```

> Call a function

```ts
const query = await client.fn('__FUNCTION_NAME__');
```

## Gatsby Example

```js
// gatsby-node.js
const { BCMSClient } = require('@becomes/cms-client');
let client;

module.exports.onCreateNode = async ({ node }) => {
  if (node.internal.type === 'Site') {
    client = await BCMSClient.instance(
      process.env.API_ORIGIN,
      {
        id: process.env.API_KEY,
        secret: process.env.API_SECRET,
      },
      false,
    );
    let myEntries = [];
    myEntries = await client
      .template('__TEMPLATE_ID__')
      .entry()
      .getAllParsed();
  }
};

module.exports.createPages = async ({ graphql, actions }) => {
  const myEntriesPageTemplate = path.resolve('./path/to/template/file.js');
  createPage({
    component: checkoutTemplate,
    path: `/my-entries`,
    context: {
      entires: myEntries,
    },
  });
};
```

## Pull and save Media

Since media uploaded via [Becomes CMS]() is not publicly available, CMS consumer application must pull, save and serve media itself. Pulling and saving can be done by CMS Client API (this repository) as shown in the snippets bellow.

### All Media

```js
// pull-media.js
const util = require('util');
const path = require('path');
const fs = require('fs');
const { BCMSClient } = require('@becomes/cms-client');
const basePath = path.join(__dirname, 'media');

async function save(data, root) {
  const parts = root.split('/');
  let base = `${basePath}`;
  for (let j = 0; j < parts.length; j = j + 1) {
    if (parts[j].indexOf('.') === -1) {
      base = path.join(base, parts[j]);
      try {
        if ((await util.promisify(fs.exists)(base)) === false) {
          await util.promisify(fs.mkdir)(base);
        }
      } catch (error) {
        console.log(`Failed to create directory '${base}'`);
      }
    }
  }
  await util.promisify(fs.writeFile)(
    path.join(base, parts[parts.length - 1]),
    data,
  );
}

async function main() {
  client = await BCMSClient.instance(
    process.env.API_ORIGIN,
    {
      id: process.env.API_KEY,
      secret: process.env.API_SECRET,
    },
    false,
  );
  const media = await client.media.all();
  media.forEach(async e => {
    const bin = await e.bin();
    await save(bin, `${e.file.path}/${e.file.name}`);
  });
}
main();
```

### Single Media

```js
// pull-media.js
const util = require('util');
const path = require('path');
const fs = require('fs');
const { BCMSClient } = require('@becomes/cms-client');
const basePath = path.join(__dirname, 'media');

async function save(data, root) {
  const parts = root.split('/');
  let base = `${basePath}`;
  for (let j = 0; j < parts.length; j = j + 1) {
    if (parts[j].indexOf('.') === -1) {
      base = path.join(base, parts[j]);
      try {
        if ((await util.promisify(fs.exists)(base)) === false) {
          await util.promisify(fs.mkdir)(base);
        }
      } catch (error) {
        console.log(`Failed to create directory '${base}'`);
      }
    }
  }
  await util.promisify(fs.writeFile)(
    path.join(base, parts[parts.length - 1]),
    data,
  );
}

async function main() {
  client = await BCMSClient.instance(
    process.env.API_ORIGIN,
    {
      id: process.env.API_KEY,
      secret: process.env.API_SECRET,
    },
    false,
  );
  const media = await client.media.get('/path/to/media');
  const bin = await media.bin();
  await save(bin, `${e.file.path}/${e.file.name}`);
}
main();
```

test