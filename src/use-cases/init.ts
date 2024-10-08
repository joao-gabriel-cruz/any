import fs from 'node:fs';
import { templateMainSlice } from '../templates/store-tamplate';
import { templateHooks } from '../templates/hooks-tamplate';
import { textSync } from 'figlet';


export const initStore = () => {
  console.log(textSync("Any"))

  fs.mkdirSync(`src/store-redux/hooks`, { recursive: true });
  fs.mkdirSync(`src/@types/redux`, { recursive: true });

  fs.writeFileSync(`src/store-redux/store.ts`, templateMainSlice());
  fs.writeFileSync(`src/store-redux/hooks/index.ts`, templateHooks());
}