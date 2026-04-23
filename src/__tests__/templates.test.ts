import { Project } from 'ts-morph';
import { templateSlice } from '../templates/slice-feature-tamplate';
import { templateFeatureModule } from '../templates/feature-module-template';
import { templateReducer } from '../templates/reducer-template';
import { templateExtraReducer } from '../templates/extra-reducer-template';
import { templateCreateUseCase } from '../templates/create-usecase-template';
import { templateIndexUseCase } from '../templates/index-usecase-template';

const makeProject = () => new Project({ useInMemoryFileSystem: true });

describe('templateSlice', () => {
  it('generates a slice file with imports, type alias and createSlice call', () => {
    const project = makeProject();
    const file = templateSlice(project, '/feat/user.slice.ts', 'User');
    const text = file.getFullText();

    expect(text).toContain(`import { createSlice } from "@reduxjs/toolkit"`);
    expect(text).toContain(`import { UserModule } from "./user.module"`);
    expect(text).toContain(`import { UserReducer } from "./reducer/user.reducer"`);
    expect(text).toContain(`import { ReduxState } from "@/@types/redux/redux"`);

    expect(file.getTypeAliasOrThrow('StateUser').isExported()).toBe(true);

    const initial = file.getVariableDeclarationOrThrow('initialStateUser');
    expect(initial.getTypeNodeOrThrow().getText()).toBe('ReduxState<StateUser>');

    const slice = file.getVariableDeclarationOrThrow('userSlice');
    expect(slice.getInitializerOrThrow().getText()).toContain('createSlice(');

    expect(text).toContain('setUser, rollbackUser');
    expect(text).toContain('userSlice.actions');
  });
});

describe('templateFeatureModule', () => {
  it('generates module file with correct paths (non-combine)', () => {
    const project = makeProject();
    const file = templateFeatureModule(project, '/feat/user.module.ts', 'User', false);
    const text = file.getFullText();

    expect(text).toContain(`from "../../../@types/redux/redux"`);
    expect(text).toContain(`from "../../../utils/redux/redux"`);
    expect(text).toContain(`import { SaveUserUseCases } from "./use-cases/save.usecases"`);
    expect(text).toContain(`import { InitUserUseCases } from "../user/use-cases/init.usecases"`);
    expect(text).toContain(`import { UserExtraReducers } from "./reducer/user-extra.reducer"`);

    expect(file.getVariableDeclarationOrThrow('initUser').getInitializerOrThrow().getText())
      .toBe('UserExtraReducers.init');
    expect(file.getVariableDeclarationOrThrow('saveUser').getInitializerOrThrow().getText())
      .toBe('UserExtraReducers.save');

    const mod = file.getVariableDeclarationOrThrow('UserModule');
    expect(mod.getTypeNodeOrThrow().getText()).toBe('ReduxModule<any>');
    expect(mod.getInitializerOrThrow().getText()).toContain('builder.addCase(init.fulfilled.extra');
    expect(mod.getInitializerOrThrow().getText()).toContain('builder.addCase(save.rejected.extra');
  });

  it('uses deeper relative paths when combine=true', () => {
    const project = makeProject();
    const file = templateFeatureModule(project, '/feat/user.module.ts', 'User', true);
    const text = file.getFullText();

    expect(text).toContain(`from "../../../../@types/redux/redux"`);
    expect(text).toContain(`from "../../../../utils/redux/redux"`);
  });
});

describe('templateReducer', () => {
  it('generates reducer with rollback function', () => {
    const project = makeProject();
    const file = templateReducer(project, '/feat/reducer/user.reducer.ts', 'User');
    const text = file.getFullText();

    expect(text).toContain(`import { current, PayloadAction } from "@reduxjs/toolkit"`);
    expect(text).toContain(`import { StateUser } from "../user.slice"`);

    const reducer = file.getVariableDeclarationOrThrow('UserReducer');
    const init = reducer.getInitializerOrThrow().getText();
    expect(init).toContain('rollbackUser');
    expect(init).toContain('state.data = state.old');
    expect(init).toContain('return {');
  });

  it('uses deeper type path when combine=true', () => {
    const project = makeProject();
    const file = templateReducer(project, '/feat/reducer/user.reducer.ts', 'User', true);
    expect(file.getFullText()).toContain(`from "../../../../../@types/redux/redux"`);
  });
});

describe('templateExtraReducer', () => {
  it('generates a class with two static createAsyncThunk properties', () => {
    const project = makeProject();
    const file = templateExtraReducer(project, '/feat/reducer/user-extra.reducer.ts', 'User');

    const cls = file.getClassOrThrow('UserExtraReducers');
    expect(cls.isExported()).toBe(true);

    expect(cls.getStaticProperties().map(p => p.getName())).toEqual(['init', 'save']);
    expect(file.getFullText()).toContain('createAsyncThunk("user/init"');
    expect(file.getFullText()).toContain('createAsyncThunk("user/save"');
  });

  it('lowercases the thunk type prefix from the class name', () => {
    const project = makeProject();
    const file = templateExtraReducer(project, '/feat/reducer/userProfile-extra.reducer.ts', 'UserProfile');
    expect(file.getFullText()).toContain(`createAsyncThunk("userprofile/init"`);
  });
});

describe('templateCreateUseCase', () => {
  it('generates use-case class extending the feature base class', () => {
    const project = makeProject();
    const file = templateCreateUseCase(project, '/feat/use-cases/init.usecases.ts', 'Init', 'User');

    const cls = file.getClassOrThrow('InitUserUseCases');
    expect(cls.getExtendsOrThrow().getText()).toBe('UserUseCases');

    const fulfilled = cls.getMethodOrThrow('fulfilled');
    expect(fulfilled.getParameters()[0].getTypeNodeOrThrow().getText()).toBe('ReduxState<StateUser>');
    expect(fulfilled.getBodyText()).toContain('state.status = "succeeded"');
    expect(fulfilled.getBodyText()).toContain('state.old = null');
  });

  it('imports from the correct base import path', () => {
    const project = makeProject();
    const file = templateCreateUseCase(project, '/feat/use-cases/save.usecases.ts', 'Save', 'User');
    const text = file.getFullText();
    expect(text).toContain(`from "../../../@types/redux/redux"`);
    expect(text).toContain(`import { UserUseCases } from "."`);
    expect(text).toContain(`import { StateUser } from "../user.slice"`);
  });
});

describe('templateIndexUseCase', () => {
  it('generates a class implementing ReduxUseCases with 3 methods', () => {
    const project = makeProject();
    const file = templateIndexUseCase(project, '/feat/use-cases/index.ts', 'User');

    const cls = file.getClassOrThrow('UserUseCases');
    expect(cls.getImplements()[0].getText()).toBe('ReduxUseCases');

    expect(cls.getMethodOrThrow('fulfilled').getBodyText()).toContain('throw new Error');
    expect(cls.getMethodOrThrow('pending').getBodyText()).toContain(`state.status = "loading"`);
    const rejectedBody = cls.getMethodOrThrow('rejected').getBodyText();
    expect(rejectedBody).toContain(`state.status = "failed"`);
    expect(rejectedBody).toContain('state.data = action.payload');
  });
});
