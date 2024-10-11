import fs from 'node:fs';
import { templateMainSlice } from '../templates/store-tamplate';
import { templateHooks } from '../templates/hooks-tamplate';
import { textSync } from 'figlet';
import { templateType } from '../templates/type-template';
import { templateUtils } from '../templates/utils-template';
import { templateRootReducer } from '../templates/root-reducer';


export const initStore = () => {
  console.log(textSync("Any"))

  fs.mkdirSync(`src/redux-store/hooks`, { recursive: true });
  fs.mkdirSync(`src/@types/redux`, { recursive: true });
  fs.mkdirSync(`src/utils/redux`, { recursive: true });

  fs.writeFileSync(`src/utils/redux/index.ts`, templateUtils());

  fs.writeFileSync(`src/@types/redux/index.d.ts`, templateType());
  fs.writeFileSync(`src/redux-store/store.ts`, templateMainSlice());
  fs.writeFileSync(`src/redux-store/root-reducer.ts`, templateRootReducer());
  fs.writeFileSync(`src/redux-store/hooks/index.ts`, templateHooks());
}