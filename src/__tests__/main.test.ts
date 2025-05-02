import { Command } from 'commander';
import { main } from '../main';
import * as fs from 'fs';
import * as featureModule from '../use-cases/feature';
import * as initModule from '../use-cases/init';
import * as configsModule from '../use-cases/configs';

// Mock dos módulos
jest.mock('../use-cases/feature');
jest.mock('../use-cases/init');
jest.mock('../use-cases/configs');
jest.mock('fs');

describe('main', () => {
  let mockProcessArgv: string[];

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    mockProcessArgv = ['node', 'script.js'];
  });

  it('should call initStore when --init option is provided', () => {
    mockProcessArgv.push('--init');
    process.argv = mockProcessArgv;

    main();

    expect(initModule.initStore).toHaveBeenCalled();
  });

  it('should call createFeature when --feature option is provided', () => {
    mockProcessArgv.push('--feature', 'test-feature');
    process.argv = mockProcessArgv;
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    main();

    expect(featureModule.createFeature).toHaveBeenCalledWith('test-feature');
  });

  it('should call createCombine when --combine option is provided', () => {
    mockProcessArgv.push('--combine', 'test-combine');
    process.argv = mockProcessArgv;
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    main();

    expect(featureModule.createCombine).toHaveBeenCalledWith('test-combine');
  });

  it('should call createCombineAndFeature when both --feature and --combine options are provided', () => {
    mockProcessArgv.push('--feature', 'test-feature', '--combine', 'test-combine');
    process.argv = mockProcessArgv;
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    main();

    expect(featureModule.createCombineAndFeature).toHaveBeenCalledWith('test-feature', 'test-combine');
  });

  it('should call getVersion when --version option is provided', () => {
    mockProcessArgv.push('--version');
    process.argv = mockProcessArgv;

    main();

    expect(configsModule.getVersion).toHaveBeenCalled();
  });

  it('should show error when redux-store does not exist for feature creation', () => {
    mockProcessArgv.push('--feature', 'test-feature');
    process.argv = mockProcessArgv;
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const consoleSpy = jest.spyOn(console, 'error');

    main();

    expect(consoleSpy).toHaveBeenCalledWith('redux-store does not exist run init command');
    expect(featureModule.createFeature).not.toHaveBeenCalled();
  });
}); 