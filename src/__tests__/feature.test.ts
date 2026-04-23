import fs from 'node:fs';
import path from 'node:path';
import { createSandbox } from './helpers/sandbox';

type FeatureModule = typeof import('../use-cases/feature');

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
  const tmp = createSandbox('feature', testName);
  fs.writeFileSync(path.join(tmp, 'tsconfig.json'), TSCONFIG);
  fs.mkdirSync(path.join(tmp, 'src/redux-store'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'src/redux-store/root-reducer.ts'), ROOT_REDUCER_SOURCE);
  return tmp;
};

const loadFeature = (): FeatureModule => {
  let mod!: FeatureModule;
  jest.isolateModules(() => {
    mod = require('../use-cases/feature');
  });
  return mod;
};

describe('feature use-cases (integration)', () => {
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

  describe('createFeature', () => {
    it('creates all files and wires the slice into root-reducer', () => {
      const { createFeature } = loadFeature();

      createFeature('profile');

      const base = path.join(tmp, 'src/redux-store/features/profile');
      expect(fs.existsSync(path.join(base, 'profile.slice.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'profile.module.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'use-cases/index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'use-cases/init.usecases.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'use-cases/save.usecases.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'reducer/profile-extra.reducer.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'reducer/profile.reducer.ts'))).toBe(true);

      const slice = fs.readFileSync(path.join(base, 'profile.slice.ts'), 'utf-8');
      expect(slice).toContain('export type StateProfile');
      expect(slice).toContain('setProfile, rollbackProfile');

      const root = fs.readFileSync(path.join(tmp, 'src/redux-store/root-reducer.ts'), 'utf-8');
      expect(root).toContain('from "@/features/profile/profile.slice"');
      expect(root).toContain('profile: profileSlice.reducer');
    });

    it('does nothing when the feature already exists', () => {
      const { createFeature } = loadFeature();
      const existing = path.join(tmp, 'src/redux-store/features/already');
      fs.mkdirSync(existing, { recursive: true });
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      createFeature('already');

      expect(errSpy).toHaveBeenCalledWith('Feature already already exists');
      expect(fs.existsSync(path.join(existing, 'already.slice.ts'))).toBe(false);
      errSpy.mockRestore();
    });
  });

  describe('createCombine', () => {
    it('creates the combine slice file and registers it in root-reducer', () => {
      const { createCombine } = loadFeature();

      createCombine('domain');

      const combineFile = path.join(tmp, 'src/redux-store/features/domain/domain.slice.ts');
      expect(fs.existsSync(combineFile)).toBe(true);

      const content = fs.readFileSync(combineFile, 'utf-8');
      expect(content).toContain('import { combineSlices } from "@reduxjs/toolkit"');
      expect(content).toContain('export const domainSlice = combineSlices()');
    });
  });

  describe('createCombineAndFeature', () => {
    it('creates the combine, the feature files and wires both', () => {
      const { createCombineAndFeature } = loadFeature();

      createCombineAndFeature('profile', 'domain');

      const base = path.join(tmp, 'src/redux-store/features/domain/profile');
      expect(fs.existsSync(path.join(base, 'profile.slice.ts'))).toBe(true);
      expect(fs.existsSync(path.join(base, 'profile.module.ts'))).toBe(true);

      const combineFile = fs.readFileSync(
        path.join(tmp, 'src/redux-store/features/domain/domain.slice.ts'),
        'utf-8',
      );
      expect(combineFile).toContain('import { profileSlice } from "./profile/profile.slice"');
      expect(combineFile).toContain('combineSlices(profileSlice)');

      const root = fs.readFileSync(path.join(tmp, 'src/redux-store/root-reducer.ts'), 'utf-8');
      expect(root).toContain('domain: domainSlice');
    });

    it('refuses to create the feature when it already exists in the combine', () => {
      const { createCombineAndFeature } = loadFeature();
      const target = path.join(tmp, 'src/redux-store/features/domain/profile');
      fs.mkdirSync(target, { recursive: true });
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      createCombineAndFeature('profile', 'domain');

      expect(errSpy).toHaveBeenCalledWith('Feature profile already exists in domain');
      expect(fs.existsSync(path.join(target, 'profile.slice.ts'))).toBe(false);
      errSpy.mockRestore();
    });
  });
});
