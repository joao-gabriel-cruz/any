import fs from 'node:fs';
import path from 'node:path';

export const SANDBOX_ROOT = path.resolve(__dirname, '../../../.test-tmp');

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const createSandbox = (suite: string, testName: string): string => {
  const dir = path.join(SANDBOX_ROOT, slug(suite), slug(testName));
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};
