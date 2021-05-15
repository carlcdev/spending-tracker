import { logger } from './';

describe('logger', () => {
  it('should have an info method', () => {
    expect(logger.info).toBeInstanceOf(Function);
  });

  it('should have an warn method', () => {
    expect(logger.warn).toBeInstanceOf(Function);
  });

  it('should have an error method', () => {
    expect(logger.error).toBeInstanceOf(Function);
  });
});
