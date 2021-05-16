import { NotFound } from './not-found';

describe('not-found', () => {
  it('should extend the Error type with a name of NotFound', () => {
    const error = new NotFound('test message');

    expect(error.message).toEqual('test message');
    expect(error.name).toEqual('NotFound');
  });
});
