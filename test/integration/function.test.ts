import { expect } from 'chai';
import { client, Env } from '../util';

describe('Entry handler', async () => {
  it('should call a function', async () => {
    const result = await client.function.call(Env.functionName, {
      test: 'Test',
    });
    expect(result)
      .to.be.a('object')
      .to.have.property('result')
      .to.have.property('test')
      .to.eq('Test');
  });
});
