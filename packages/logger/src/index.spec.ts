import { logger, initLogger } from './';

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

  describe('initLogger', () => {
    it('should not add the console transport if NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';

      const loggerAddSpy = jest.spyOn(logger, 'add');

      initLogger('test namespace');

      expect(loggerAddSpy).toBeCalledTimes(0);
    });

    it('should add the console transport if not already initialised', () => {
      process.env.NODE_ENV = 'production';

      const loggerAddSpy = jest.spyOn(logger, 'add');

      initLogger('test namespace');

      expect(loggerAddSpy).toBeCalledTimes(1);
    });

    it('should not add another transpot if the logger is already initialised', () => {
      process.env.NODE_ENV = 'production';

      const loggerAddSpy = jest.spyOn(logger, 'add');

      initLogger('test namespace');
      initLogger('test namespace');
      initLogger('test namespace');

      expect(loggerAddSpy).toBeCalledTimes(1);
    });
  });
});
