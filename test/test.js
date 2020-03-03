const chai = require('chai');
const expect = chai.expect;
const { BCMSClient } = require('../dist');

let restClient;
let entryId;

describe('REST Client', async () => {
  describe('Templates', async () => {
    it('should get a Template and check the response.', async () => {
      restClient = await BCMSClient.instance(
        process.env.API_ORIGIN,
        {
          id: process.env.API_KEY,
          secret: process.env.API_SECRET,
        },
        false,
      );
      const result = await restClient.template(process.env.TEMPLATE_ID).get();
      expect(result).to.have.property('entryTemplate');
      expect(result)
        .to.have.property('entryIds')
        .to.be.a('array');
      expect(result).to.have.property('_id');
      expect(result).to.have.property('createdAt');
      expect(result).to.have.property('updatedAt');
      expect(result).to.have.property('type');
      expect(result).to.have.property('name');
      expect(result).to.have.property('desc');
      expect(result).to.have.property('userId');
    });
  });
  describe('Entries', async () => {
    it('should get a single Entry and check the response.', async () => {
      const result = await restClient
        .template(process.env.TEMPLATE_ID)
        .entry(process.env.ENTRY_ID)
        .get();
      expect(result)
        .to.have.property('content')
        .to.be.a('array');
      expect(result)
        .to.have.property('_id')
        .to.be.a('string');
      expect(result)
        .to.have.property('createdAt')
        .to.be.a('number');
      expect(result)
        .to.have.property('updatedAt')
        .to.be.a('number');
      expect(result)
        .to.have.property('templateId')
        .to.be.a('string');
      expect(result)
        .to.have.property('userId')
        .to.be.a('string');
    });
    it('should get a single Entry with parsed props and check the response.', async () => {
      const result = await restClient
        .template(process.env.TEMPLATE_ID)
        .entry(process.env.ENTRY_ID)
        .getParsed();
      expect(result).to.have.property('en');
      expect(result).to.have.nested.property('en.meta');
      expect(result).to.have.nested.property('en.meta._id');
      expect(result).to.have.nested.property('en.meta.createdAt');
      expect(result).to.have.nested.property('en.meta.updatedAt');
      expect(result).to.have.nested.property('en.meta.user');
      expect(result).to.have.nested.property('en.meta.user._id');
      expect(result).to.have.nested.property('en.meta.title');
      expect(result).to.have.nested.property('en.meta.slug');
      expect(result).to.have.nested.property('en.meta.description');
      expect(result).to.have.nested.property('en.meta.coverImageUri');
      expect(result)
        .to.have.nested.property('en.content')
        .to.be.a('array');
    });
    it('should get all Entries and check the response.', async () => {
      const result = await restClient
        .template(process.env.TEMPLATE_ID)
        .entry()
        .getAll();
      expect(result).to.be.a('array');
      expect(result[0])
        .to.have.property('content')
        .to.be.a('array');
      expect(result[0])
        .to.have.property('_id')
        .to.be.a('string');
      expect(result[0])
        .to.have.property('createdAt')
        .to.be.a('number');
      expect(result[0])
        .to.have.property('updatedAt')
        .to.be.a('number');
      expect(result[0])
        .to.have.property('templateId')
        .to.be.a('string');
      expect(result[0])
        .to.have.property('userId')
        .to.be.a('string');
    });
    it('should get all Entries with parsed props and check the response.', async () => {
      const result = await restClient
        .template(process.env.TEMPLATE_ID)
        .entry()
        .getAllParsed();
      expect(result).to.be.a('array');
      expect(result[0]).to.have.property('en');
      expect(result[0]).to.have.nested.property('en.meta');
      expect(result[0]).to.have.nested.property('en.meta._id');
      expect(result[0]).to.have.nested.property('en.meta.createdAt');
      expect(result[0]).to.have.nested.property('en.meta.updatedAt');
      expect(result[0]).to.have.nested.property('en.meta.user');
      expect(result[0]).to.have.nested.property('en.meta.user._id');
      expect(result[0]).to.have.nested.property('en.meta.title');
      expect(result[0]).to.have.nested.property('en.meta.slug');
      expect(result[0]).to.have.nested.property('en.meta.description');
      expect(result[0]).to.have.nested.property('en.meta.coverImageUri');
      expect(result[0])
        .to.have.nested.property('en.content')
        .to.be.a('array');
    });
    it('should add new Entry and check the response.', async () => {
      const result = await restClient
        .template(process.env.TEMPLATE_ID)
        .entry()
        .add([
          {
            lng: 'en',
            props: [
              {
                name: 'test_string',
                required: true,
                type: 'STRING',
                value: 'This is test 2.',
              },
              {
                name: 'content',
                required: true,
                type: 'QUILL',
                value: {
                  content: [],
                  heading: {
                    coverImageUri: '',
                    desc: 'Desc 2',
                    slug: 'test-2',
                    title: 'Test 2',
                  },
                },
              },
            ],
          },
        ]);
      entryId = result._id;
      expect(result).to.be.a('object');
      expect(result)
        .to.have.property('_id')
        .to.be.a('string');
      expect(result)
        .to.have.property('createdAt')
        .to.be.a('number');
      expect(result)
        .to.have.property('updatedAt')
        .to.be.a('number');
      expect(result)
        .to.have.property('templateId')
        .to.be.a('string')
        .to.be.equal(process.env.TEMPLATE_ID);
      expect(result)
        .to.have.property('userId')
        .to.be.a('string');
      expect(result)
        .to.have.property('content')
        .to.be.a('array');
      expect(result.content[0])
        .to.have.property('lng')
        .to.be.a('string')
        .to.be.equal('en');
      expect(result.content[0])
        .to.have.property('props')
        .to.be.a('array')
        .to.have.length(2);

      expect(result.content[0].props[0])
        .to.have.property('name')
        .to.be.a('string')
        .to.be.equal('test_string');
      expect(result.content[0].props[0])
        .to.have.property('required')
        .to.be.a('boolean')
        .to.be.equal(true);
      expect(result.content[0].props[0])
        .to.have.property('type')
        .to.be.a('string')
        .to.be.equal('STRING');
      expect(result.content[0].props[0])
        .to.have.property('value')
        .to.be.a('string')
        .to.be.equal('This is test 2.');

      expect(result.content[0].props[1])
        .to.have.property('name')
        .to.be.a('string')
        .to.be.equal('content');
      expect(result.content[0].props[1])
        .to.have.property('required')
        .to.be.a('boolean')
        .to.be.equal(true);
      expect(result.content[0].props[1])
        .to.have.property('type')
        .to.be.a('string')
        .to.be.equal('QUILL');
      expect(result.content[0].props[1])
        .to.have.property('value')
        .to.be.a('object');
      expect(result.content[0].props[1].value)
        .to.have.property('content')
        .to.be.a('array');
      expect(result.content[0].props[1].value)
        .to.have.property('heading')
        .to.be.a('object');
      expect(result.content[0].props[1].value.heading)
        .to.have.property('coverImageUri')
        .to.be.a('string')
        .to.be.equal('');
      expect(result.content[0].props[1].value.heading)
        .to.have.property('title')
        .to.be.a('string')
        .to.be.equal('Test 2');
      expect(result.content[0].props[1].value.heading)
        .to.have.property('desc')
        .to.be.a('string')
        .to.be.equal('Desc 2');
      expect(result.content[0].props[1].value.heading)
        .to.have.property('slug')
        .to.be.a('string')
        .to.be.equal('test-2');
    });
    it('should update an Entry and check the response.', async () => {
      expect(entryId).to.be.a('string');
      const result = await restClient
        .template(process.env.TEMPLATE_ID)
        .entry(entryId)
        .update([
          {
            lng: 'en',
            props: [
              {
                name: 'test_string',
                required: true,
                type: 'STRING',
                value: 'This is test 3.',
              },
              {
                name: 'content',
                required: true,
                type: 'QUILL',
                value: {
                  content: [],
                  heading: {
                    coverImageUri: '',
                    desc: 'Desc 3',
                    slug: 'test-3',
                    title: 'Test 3',
                  },
                },
              },
            ],
          },
        ]);
      expect(result).to.be.a('object');
      expect(result)
        .to.have.property('_id')
        .to.be.a('string')
        .to.be.equal(entryId);
      expect(result)
        .to.have.property('createdAt')
        .to.be.a('number');
      expect(result)
        .to.have.property('updatedAt')
        .to.be.a('number');
      expect(result)
        .to.have.property('templateId')
        .to.be.a('string');
      expect(result)
        .to.have.property('userId')
        .to.be.a('string');
      expect(result)
        .to.have.property('content')
        .to.be.a('array');
    });
  });
  describe('Media', async () => {
    it('should get all Media and check the response.', async () => {
      const result = await restClient.media.all();
      expect(result).to.be.a('array');
      expect(result[0])
        .to.have.property('file')
        .to.be.a('object');
      expect(result[0])
        .to.have.property('bin')
        .to.be.a('function');
      expect(result[0].file)
        .to.have.property('childrenIds')
        .to.be.a('array');
      expect(result[0].file)
        .to.have.property('_id')
        .to.be.a('string');
      expect(result[0].file)
        .to.have.property('createdAt')
        .to.be.a('number');
      expect(result[0].file)
        .to.have.property('updatedAt')
        .to.be.a('number');
      expect(result[0].file)
        .to.have.property('userId')
        .to.be.a('string');
      expect(result[0].file)
        .to.have.property('type')
        .to.be.a('string');
      expect(result[0].file)
        .to.have.property('mimetype')
        .to.be.a('string');
      expect(result[0].file)
        .to.have.property('name')
        .to.be.a('string');
      expect(result[0].file)
        .to.have.property('path')
        .to.be.a('string');
      expect(result[0].file)
        .to.have.property('isInRoot')
        .to.be.a('boolean');
    });
    it('should get a single Media and check the response.', async () => {
      const result = await restClient.media.get(
        '/case-studies/airbus/airbus.png',
      );
      expect(result).to.be.a('object');
      expect(result)
        .to.have.property('file')
        .to.be.a('object');
      expect(result)
        .to.have.property('bin')
        .to.be.a('function');
      expect(result.file)
        .to.have.property('childrenIds')
        .to.be.a('array');
      expect(result.file)
        .to.have.property('_id')
        .to.be.a('string');
      expect(result.file)
        .to.have.property('createdAt')
        .to.be.a('number');
      expect(result.file)
        .to.have.property('updatedAt')
        .to.be.a('number');
      expect(result.file)
        .to.have.property('userId')
        .to.be.a('string');
      expect(result.file)
        .to.have.property('type')
        .to.be.a('string');
      expect(result.file)
        .to.have.property('mimetype')
        .to.be.a('string');
      expect(result.file)
        .to.have.property('name')
        .to.be.a('string');
      expect(result.file)
        .to.have.property('path')
        .to.be.a('string');
      expect(result.file)
        .to.have.property('isInRoot')
        .to.be.a('boolean');
      const bin = await result.bin();
      expect(bin).to.be.an.instanceof(Buffer);
    });
  });
  describe('Functions', async () => {
    it('should make a call to a Function and check the response.', async () => {
      const result = await restClient.fn('test');
      expect(result).to.be.a('string');
    });
  });
});
