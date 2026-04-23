import fs from 'node:fs';
import path from 'node:path';
import { createSandbox } from './helpers/sandbox';

jest.mock('figlet', () => ({ textSync: () => '' }));

import { initStore } from '../use-cases/init';

describe('initStore (integration)', () => {
  let tmp: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmp = createSandbox('init', expect.getState().currentTestName ?? 'unknown');
    process.chdir(tmp);
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it('creates the redux scaffold and writes path alias into tsconfig.json', async () => {
    fs.writeFileSync(path.join(tmp, 'tsconfig.json'), '{}');

    await initStore();

    const tsconfig = JSON.parse(fs.readFileSync(path.join(tmp, 'tsconfig.json'), 'utf-8'));
    expect(tsconfig.compilerOptions.baseUrl).toBe('.');
    expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['src/*']);

    expect(fs.existsSync(path.join(tmp, 'src/utils/redux/index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'src/@types/redux/index.d.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'src/redux-store/store.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'src/redux-store/root-reducer.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'src/redux-store/hooks/index.ts'))).toBe(true);
  });

  it('generates a root-reducer with an empty propsCombineReducer object', async () => {
    fs.writeFileSync(path.join(tmp, 'tsconfig.json'), '{}');

    await initStore();

    const root = fs.readFileSync(path.join(tmp, 'src/redux-store/root-reducer.ts'), 'utf-8');
    expect(root).toContain('import { combineReducers } from "@reduxjs/toolkit"');
    expect(root).toContain('propsCombineReducer = {}');
    expect(root).toContain('combineReducers(propsCombineReducer)');
    expect(root).toContain('export { rootReducer }');
  });

  it('preserves existing compilerOptions when patching tsconfig.json', async () => {
    fs.writeFileSync(
      path.join(tmp, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { target: 'es2020', strict: true } }),
    );

    await initStore();

    const tsconfig = JSON.parse(fs.readFileSync(path.join(tmp, 'tsconfig.json'), 'utf-8'));
    expect(tsconfig.compilerOptions.target).toBe('es2020');
    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['src/*']);
  });
});
