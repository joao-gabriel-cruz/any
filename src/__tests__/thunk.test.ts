import fs from 'node:fs';
import path from 'node:path';
import { createSandbox } from './helpers/sandbox';

type FeatureModule = typeof import('../use-cases/feature');
type ThunkModule = typeof import('../use-cases/thunk');

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    target: 'es2020',
    module: 'commonjs',
    strict: true,
    esModuleInterop: true,
    baseUrl: '.',
    paths: { '@/*': ['src/*'] },
  },
  include: ['src/**/*'],
});

const ROOT_REDUCER_SOURCE = `import { combineReducers } from "@reduxjs/toolkit";

const propsCombineReducer = {};

const rootReducer = combineReducers(propsCombineReducer);

export { rootReducer };
`;

const setupSandbox = (testName: string): string => {
  const tmp = createSandbox('thunk', testName);
  fs.writeFileSync(path.join(tmp, 'tsconfig.json'), TSCONFIG);
  fs.mkdirSync(path.join(tmp, 'src/redux-store'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'src/redux-store/root-reducer.ts'), ROOT_REDUCER_SOURCE);
  return tmp;
};

const load = (): { feature: FeatureModule; thunk: ThunkModule } => {
  let feature!: FeatureModule;
  let thunk!: ThunkModule;
  jest.isolateModules(() => {
    feature = require('../use-cases/feature');
    thunk = require('../use-cases/thunk');
  });
  return { feature, thunk };
};

describe('createThunk (integration)', () => {
  let tmp: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmp = setupSandbox(expect.getState().currentTestName ?? 'unknown');
    process.chdir(tmp);
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it('adds extra-reducer property, use-case file and module wiring for a new thunk', () => {
    const { feature, thunk } = load();
    feature.createFeature('profile');

    thunk.createThunk('load', 'profile');

    const base = path.join(tmp, 'src/redux-store/features/profile');

    const extra = fs.readFileSync(path.join(base, 'reducer/profile-extra.reducer.ts'), 'utf-8');
    expect(extra).toContain('static load = createAsyncThunk("profile/load"');
    expect(extra).toContain('static init =');
    expect(extra).toContain('static save =');

    const useCase = fs.readFileSync(path.join(base, 'use-cases/load.usecases.ts'), 'utf-8');
    expect(useCase).toContain('export class LoadProfileUseCases extends ProfileUseCases');
    expect(useCase).toContain('fulfilled(state: ReduxState<StateProfile>)');

    const mod = fs.readFileSync(path.join(base, 'profile.module.ts'), 'utf-8');
    expect(mod).toContain('import { LoadProfileUseCases } from "./use-cases/load.usecases"');
    expect(mod).toContain('export const loadProfile = ProfileExtraReducers.load');
    expect(mod).toContain('const load = combineUseCasesWithExtraReducers(');
    expect(mod).toContain('new LoadProfileUseCases()');
    expect(mod).toContain('extraReducers: loadProfile');
    expect(mod).toContain('builder.addCase(load.fulfilled.extra, load.fulfilled.useCase)');
    expect(mod).toContain('builder.addCase(load.pending.extra, load.pending.useCase)');
    expect(mod).toContain('builder.addCase(load.rejected.extra, load.rejected.useCase)');
    expect(mod).toContain('builder.addCase(init.fulfilled.extra');
    expect(mod).toContain('builder.addCase(save.fulfilled.extra');
  });

  it('preserves previous thunks when adding another one', () => {
    const { feature, thunk } = load();
    feature.createFeature('profile');

    thunk.createThunk('load', 'profile');
    thunk.createThunk('sync', 'profile');

    const mod = fs.readFileSync(
      path.join(tmp, 'src/redux-store/features/profile/profile.module.ts'),
      'utf-8',
    );
    expect(mod).toContain('builder.addCase(load.fulfilled.extra');
    expect(mod).toContain('builder.addCase(sync.fulfilled.extra');
  });

  it('refuses to create a thunk when the feature does not exist', () => {
    const { thunk } = load();
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    thunk.createThunk('load', 'ghost');

    expect(errSpy).toHaveBeenCalledWith('Feature ghost does not exist');
    errSpy.mockRestore();
  });

  it('refuses to recreate an existing thunk', () => {
    const { feature, thunk } = load();
    feature.createFeature('profile');
    thunk.createThunk('load', 'profile');
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    thunk.createThunk('load', 'profile');

    expect(errSpy).toHaveBeenCalledWith('Thunk load already exists in feature profile');
    errSpy.mockRestore();
  });

  it('works when the feature lives under a combine group', () => {
    const { feature, thunk } = load();
    feature.createCombineAndFeature('profile', 'user');

    thunk.createThunk('load', 'profile', 'user');

    const base = path.join(tmp, 'src/redux-store/features/user/profile');
    expect(fs.existsSync(path.join(base, 'use-cases/load.usecases.ts'))).toBe(true);

    const mod = fs.readFileSync(path.join(base, 'profile.module.ts'), 'utf-8');
    expect(mod).toContain('import { LoadProfileUseCases } from "./use-cases/load.usecases"');
    expect(mod).toContain('builder.addCase(load.fulfilled.extra');
  });
});
