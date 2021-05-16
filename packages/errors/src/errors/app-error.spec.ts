import { AppError } from './app-error';

describe('app-error', () => {
  it('should extend the Error type with a name of AppError', () => {
    const error = new AppError('test message');

    expect(error.message).toEqual('test message');
    expect(error.name).toEqual('AppError');
  });
});
