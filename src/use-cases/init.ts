import fs from 'node:fs';
import { templateMainSlice } from '../templates/store-tamplate';
import { templateHooks } from '../templates/hooks-tamplate';
import { textSync } from 'figlet';
import { templateType } from '../templates/type-template';
import { templateUtils } from '../templates/utils-template';
import { templateRootReducer } from '../templates/root-reducer';


export const initStore = () => {
  console.log(textSync("Any"))

  fs.mkdirSync(`src/store-redux/hooks`, { recursive: true });
  fs.mkdirSync(`src/@types/redux`, { recursive: true });
  fs.mkdirSync(`src/utils/redux`, { recursive: true });

  fs.writeFileSync(`src/utils/redux/redux.ts`, templateUtils());

  fs.writeFileSync(`src/@types/redux/redux.d.ts`, templateType());
  fs.writeFileSync(`src/store-redux/store.ts`, templateMainSlice());
  fs.writeFileSync(`src/store-redux/root-reducer.ts`, templateRootReducer());
  fs.writeFileSync(`src/store-redux/hooks/index.ts`, templateHooks());
}