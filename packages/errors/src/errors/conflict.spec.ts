import { Conflict } from './conflict';

describe('conflict', () => {
  it('should extend the Error type with a name of Conflict', () => {
    const error = new Conflict('test message');

    expect(error.message).toEqual('test message');
    expect(error.name).toEqual('Conflict');
  });
});
