const chai = require('chai');
const expect = chai.expect;
const { BCMSClient } = require('../dist');
const restClient = new BCMSClient(
  process.env.API_ORIGIN,
  {
    id: process.env.API_KEY,
    secret: process.env.API_SECRET,
  },
  false,
);

describe('REST Client', () => {
  it('Get Template', async () => {
    const result = await restClient.template('5e29a5d0bea94e001211b0a2').get();
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
      .template('5e29a5d0bea94e001211b0a2')
      .entry('5e2adb5e0d06e25fb4cabd59')
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
      .template('5e29a5d0bea94e001211b0a2')
      .entry('5e2adb5e0d06e25fb4cabd59')
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
      .template('5e29a5d0bea94e001211b0a2')
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
      .template('5e29a5d0bea94e001211b0a2')
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
});
