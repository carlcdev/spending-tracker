import { BadRequest } from './bad-request';

describe('bad-request', () => {
  it('should extend the Error type with a name of BadRequest', () => {
    const error = new BadRequest('test message');

    expect(error.message).toEqual('test message');
    expect(error.name).toEqual('BadRequest');
  });
});
