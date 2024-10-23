"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStore = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const store_tamplate_1 = require("../templates/store-tamplate");
const hooks_tamplate_1 = require("../templates/hooks-tamplate");
const figlet_1 = require("figlet");
const type_template_1 = require("../templates/type-template");
const utils_template_1 = require("../templates/utils-template");
const root_reducer_1 = require("../templates/root-reducer");
const initStore = () => {
    console.log((0, figlet_1.textSync)("Any"));
    node_fs_1.default.mkdirSync(`src/redux-store/hooks`, { recursive: true });
    node_fs_1.default.mkdirSync(`src/@types/redux`, { recursive: true });
    node_fs_1.default.mkdirSync(`src/utils/redux`, { recursive: true });
    node_fs_1.default.writeFileSync(`src/utils/redux/index.ts`, (0, utils_template_1.templateUtils)());
    node_fs_1.default.writeFileSync(`src/@types/redux/index.d.ts`, (0, type_template_1.templateType)());
    node_fs_1.default.writeFileSync(`src/redux-store/store.ts`, (0, store_tamplate_1.templateMainSlice)());
    node_fs_1.default.writeFileSync(`src/redux-store/root-reducer.ts`, (0, root_reducer_1.templateRootReducer)());
    node_fs_1.default.writeFileSync(`src/redux-store/hooks/index.ts`, (0, hooks_tamplate_1.templateHooks)());
};
exports.initStore = initStore;
//# sourceMappingURL=init.js.map