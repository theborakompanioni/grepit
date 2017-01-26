import download from '../src/download.js';

describe('download', () => {
  it('should be running without any problems', () => {
    expect(download).to.not.throw();
  });
});
