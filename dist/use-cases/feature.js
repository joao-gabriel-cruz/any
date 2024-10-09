"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeature = exports.createCombineAndFeature = exports.createCombine = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const slice_feature_tamplate_1 = require("../templates/slice-feature-tamplate");
const extra_reducer_template_1 = require("../templates/extra-reducer-template");
const reducer_template_1 = require("../templates/reducer-template");
const create_usecase_template_1 = require("../templates/create-usecase-template");
const index_usecase_template_1 = require("../templates/index-usecase-template");
const feature_module_template_1 = require("../templates/feature-module-template");
const ts_morph_1 = require("ts-morph");
const project = new ts_morph_1.Project({
    tsConfigFilePath: "tsconfig.json",
});
const createCombine = (combineRoot) => {
    node_fs_1.default.mkdirSync(`src/store-redux/features/${combineRoot}`, { recursive: true });
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${combineRoot}.slice.ts`, "");
    const combineFiles = project.addSourceFileAtPath(`src/store-redux/features/${combineRoot}/${combineRoot}.slice.ts`);
    combineFiles.addImportDeclaration({
        moduleSpecifier: `@reduxjs/toolkit`,
        namedImports: ["combineSlices"]
    });
    combineFiles.addVariableStatement({
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        declarations: [{
                name: `${combineRoot}Slice`,
                initializer: `combineSlices()`
            }],
        isExported: true,
    });
    combineFiles.saveSync();
};
exports.createCombine = createCombine;
const createCombineAndFeature = (name, combineRoot) => {
    const upName = name.charAt(0).toUpperCase() + name.slice(1);
    // const upCombineRoot = combineRoot.charAt(0).toUpperCase() + combineRoot.slice(1);
    const existCombine = node_fs_1.default.existsSync(`src/store-redux/features/${combineRoot}`);
    const existFeature = node_fs_1.default.existsSync(`src/store-redux/features/${combineRoot}/${name}`);
    if (existFeature) {
        console.error(`Feature ${name} already exists in ${combineRoot}`);
        return;
    }
    if (!existCombine) {
        (0, exports.createCombine)(combineRoot);
    }
    node_fs_1.default.mkdirSync(`src/store-redux/features/${combineRoot}/${name}/use-cases`, { recursive: true });
    node_fs_1.default.mkdirSync(`src/store-redux/features/${combineRoot}/${name}/reducer`, { recursive: true });
    node_fs_1.default.mkdirSync(`src/store-redux/features/${combineRoot}/${name}`, { recursive: true });
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/${name}.slice.ts`, (0, slice_feature_tamplate_1.templateSlice)(upName, true));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/${name}.module.ts`, (0, feature_module_template_1.templateFeatureModule)(upName, true));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/use-cases/index.ts`, (0, index_usecase_template_1.templateIndexUseCase)(upName, true));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/use-cases/init.usecases.ts`, (0, create_usecase_template_1.templateCreateUseCase)("Init", upName, true));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/use-cases/save.usecases.ts`, (0, create_usecase_template_1.templateCreateUseCase)("Save", upName, true));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/reducer/${name}-extra.reducer.ts`, (0, extra_reducer_template_1.templateExtraReducer)(upName, true));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${combineRoot}/${name}/reducer/${name}.reducer.ts`, (0, reducer_template_1.templateReducer)(upName, true));
    const rootReducerFiles = project.addSourceFileAtPath("src/store-redux/root-reducer.ts");
    rootReducerFiles.addImportDeclaration({
        moduleSpecifier: `./features/${combineRoot}/${name}/${name}.slice`,
        namedImports: [`${name}Slice`]
    });
    const variebleRoot = rootReducerFiles.getVariableDeclarationOrThrow("rootReducer");
    const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.ObjectLiteralExpression);
    objectLiteral.addPropertyAssignment({
        name: name,
        initializer: `${name}Slice.reducer`
    });
    const combineSliceFiles = project.addSourceFileAtPath(`src/store-redux/features/${combineRoot}/${combineRoot}.slice.ts`);
    combineSliceFiles.addImportDeclaration({
        moduleSpecifier: `./${name}/${name}.slice`,
        namedImports: [`${name}Slice`]
    });
    const variebleCombine = combineSliceFiles.getVariableDeclarationOrThrow(`${combineRoot}Slice`);
    const objectLiteralCombine = variebleCombine.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.CallExpression);
    objectLiteralCombine.addArgument(`${name}Slice`);
    combineSliceFiles.saveSync();
    rootReducerFiles.saveSync();
};
exports.createCombineAndFeature = createCombineAndFeature;
const createFeature = (name) => {
    const upName = name.charAt(0).toUpperCase() + name.slice(1);
    const existFeature = node_fs_1.default.existsSync(`src/store-redux/features/${name}`);
    if (existFeature) {
        console.error(`Feature ${name} already exists`);
        return;
    }
    console.log(`Creating feature ${name}`);
    node_fs_1.default.mkdirSync(`src/store-redux/features/${name}/use-cases`, { recursive: true });
    node_fs_1.default.mkdirSync(`src/store-redux/features/${name}/reducer`, { recursive: true });
    node_fs_1.default.mkdirSync(`src/store-redux/features/${name}`, { recursive: true });
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/${name}.slice.ts`, (0, slice_feature_tamplate_1.templateSlice)(upName));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/${name}.module.ts`, (0, feature_module_template_1.templateFeatureModule)(upName));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/use-cases/index.ts`, (0, index_usecase_template_1.templateIndexUseCase)(upName));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/use-cases/init.usecases.ts`, (0, create_usecase_template_1.templateCreateUseCase)("Init", upName));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/use-cases/save.usecases.ts`, (0, create_usecase_template_1.templateCreateUseCase)("Save", upName));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/reducer/${name}-extra.reducer.ts`, (0, extra_reducer_template_1.templateExtraReducer)(upName));
    node_fs_1.default.writeFileSync(`src/store-redux/features/${name}/reducer/${name}.reducer.ts`, (0, reducer_template_1.templateReducer)(upName));
    const sourceFiles = project.addSourceFileAtPath("src/store-redux/root-reducer.ts");
    sourceFiles.addImportDeclaration({
        moduleSpecifier: `./features/${name}/${name}.slice`,
        namedImports: [`${name}Slice`]
    });
    const variebleRoot = sourceFiles.getVariableDeclarationOrThrow("rootReducer");
    const objectLiteral = variebleRoot.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.ObjectLiteralExpression);
    objectLiteral.addPropertyAssignment({
        name: name,
        initializer: `${name}Slice.reducer`
    });
    sourceFiles.saveSync();
};
exports.createFeature = createFeature;
//# sourceMappingURL=feature.js.map