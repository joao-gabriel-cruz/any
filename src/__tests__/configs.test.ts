import { getVersion } from '../use-cases/configs';

// Mock do package.json
jest.mock('../../package.json', () => ({
  version: '1.0.0'
}), { virtual: true });

describe('Configs Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log the correct version number', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    await getVersion();

    expect(consoleSpy).toHaveBeenCalledWith('any v1.0.0');
  });
}); 