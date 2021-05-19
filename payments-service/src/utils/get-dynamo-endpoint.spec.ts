import { getDynamoEndpoint } from './get-dynamo-endpoint';

describe('get-dynamo-endpoint', () => {
  describe('when the stage is set to local', () => {
    beforeEach(() => {
      process.env.STAGE = 'local';
    });

    it('should return the localhost endpoint', () => {
      const result = getDynamoEndpoint();

      expect(result).toEqual('http://localhost:4566');
    });
  });

  describe('when the stage is set to prod', () => {
    beforeEach(() => {
      process.env.STAGE = 'prod';
    });

    it('should return the localhost endpoint', () => {
      const result = getDynamoEndpoint();

      expect(result).toBeUndefined();
    });
  });
});
