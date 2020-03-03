const chai = require('chai');
const expect = chai.expect;
const { BCMSClient } = require('../dist');

let restClient;

describe('REST Client', () => {
  it('Get Template', async () => {
    restClient = await BCMSClient.instance(
      process.env.API_ORIGIN,
      {
        id: process.env.API_KEY,
        secret: process.env.API_SECRET,
      },
      false,
    );
    const result = await restClient.template('5e4283b2dc14c94bc68cb1bf').get();
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
  it('Get Entry', async () => {
    const result = await restClient
      .template('5e4283b2dc14c94bc68cb1bf')
      .entry('5e4a79158397cf2695f950f5')
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
  it('Get parsed Entry', async () => {
    const result = await restClient
      .template('5e4283b2dc14c94bc68cb1bf')
      .entry('5e4a79158397cf2695f950f5')
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
  it('Get all Entries', async () => {
    const result = await restClient
      .template('5e4283b2dc14c94bc68cb1bf')
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
  it('Get all parsed Entries', async () => {
    const result = await restClient
      .template('5e4283b2dc14c94bc68cb1bf')
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
  it('Get all Media', async () => {
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
  it('Get Media', async () => {
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
  it('Call Function', async () => {
    const result = await restClient.fn('test');
    expect(result).to.be.a('string');
  });
});
