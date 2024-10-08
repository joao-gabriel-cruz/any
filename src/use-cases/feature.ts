import fs from 'node:fs';
import { templateSlice } from '../templates/slice-feature-tamplate';
import { templateExtraReducer } from '../templates/extra-reducer-template';
import { templateReducer } from '../templates/reducer-template';

const updateMainSlice = (name: string) => {};

export const createFeature = (name: string) => {
  const upName = name.charAt(0).toUpperCase() + name.slice(1);
  console.log(`Creating feature ${name}`);
  fs.mkdirSync(`src/store-redux/features/${name}/use-cases`,{ recursive: true });
  fs.mkdirSync(`src/store-redux/features/${name}/reducer`,{ recursive: true });
  fs.mkdirSync(`src/store-redux/features/${name}`,{ recursive: true });

  fs.writeFileSync(`src/store-redux/features/${name}/${name}.slice.ts`, templateSlice(upName));
  fs.writeFileSync(`src/store-redux/features/${name}/${name}.module.ts`, "");

  fs.writeFileSync(`src/store-redux/features/${name}/use-cases/index.ts`, "");
  fs.writeFileSync(`src/store-redux/features/${name}/use-cases/init.usecases.ts`, "");
  fs.writeFileSync(`src/store-redux/features/${name}/use-cases/save.usecases.ts`, "");

  fs.writeFileSync(`src/store-redux/features/${name}/reducer/${name}-extra.reducer.ts`, templateExtraReducer(name));
  fs.writeFileSync(`src/store-redux/features/${name}/reducer/${name}.reducer.ts`, templateReducer(name));


}