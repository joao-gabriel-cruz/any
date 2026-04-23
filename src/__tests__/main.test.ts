import * as fs from 'fs';

jest.mock('../use-cases/feature', () => ({
  createFeature: jest.fn(),
  createCombine: jest.fn(),
  createCombineAndFeature: jest.fn(),
}));
jest.mock('../use-cases/init', () => ({ initStore: jest.fn() }));
jest.mock('../use-cases/configs', () => ({ getVersion: jest.fn() }));
jest.mock('../use-cases/thunk', () => ({ createThunk: jest.fn() }));
jest.mock('fs');

import { main } from '../main';
import * as feature from '../use-cases/feature';
import * as init from '../use-cases/init';
import * as configs from '../use-cases/configs';
import * as thunk from '../use-cases/thunk';

describe('main CLI dispatcher', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.clearAllMocks();
    process.argv = ['node', 'any'];
  });

  afterAll(() => {
    process.argv = originalArgv;
  });

  it('dispatches to initStore on --init', () => {
    process.argv.push('--init');
    main();
    expect(init.initStore).toHaveBeenCalledTimes(1);
  });

  it('dispatches to createFeature on --feature when store exists', () => {
    process.argv.push('--feature', 'profile');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    main();
    expect(feature.createFeature).toHaveBeenCalledWith('profile');
  });

  it('dispatches to createCombine on --combine alone when store exists', () => {
    process.argv.push('--combine', 'domain');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    main();
    expect(feature.createCombine).toHaveBeenCalledWith('domain');
  });

  it('dispatches to createCombineAndFeature when --feature and --combine are both given', () => {
    process.argv.push('--feature', 'profile', '--combine', 'domain');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    main();
    expect(feature.createCombineAndFeature).toHaveBeenCalledWith('profile', 'domain');
  });

  it('dispatches to getVersion on --version', () => {
    process.argv.push('--version');
    main();
    expect(configs.getVersion).toHaveBeenCalledTimes(1);
  });

  it('dispatches to createThunk when --thunk is paired with --feature', () => {
    process.argv.push('--thunk', 'load', '--feature', 'profile');
    main();
    expect(thunk.createThunk).toHaveBeenCalledWith('load', 'profile', undefined);
  });

  it('refuses --thunk without --feature', () => {
    process.argv.push('--thunk', 'load');
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    main();
    expect(thunk.createThunk).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalledWith('Feature is required to create a thunk');
    errSpy.mockRestore();
  });

  it('logs an error and skips when --feature is given but redux-store is missing', () => {
    process.argv.push('--feature', 'profile');
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    main();
    expect(feature.createFeature).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalledWith('redux-store does not exist run init command');
    errSpy.mockRestore();
  });
});
