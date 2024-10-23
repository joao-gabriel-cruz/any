#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const feature_1 = require("./use-cases/feature");
const init_1 = require("./use-cases/init");
const fs_1 = __importDefault(require("fs"));
const configs_1 = require("./use-cases/configs");
function main() {
    const program = new commander_1.Command();
    program
        .option("-f, --feature <feature>", "new feature")
        .option("-i, --init", "init project")
        .option("-c, --combine <combine>", "combine feature")
        .option("-v, --version ", "version project")
        .parse(process.argv);
    const options = program.opts();
    if (options.init) {
        (0, init_1.initStore)();
        return;
    }
    if (!options.feature && options.combine) {
        const existStore = fs_1.default.existsSync(`src/redux-store`);
        if (!existStore) {
            console.error(`redux-store does not exist`);
            return;
        }
        (0, feature_1.createCombine)(options.combine);
        return;
    }
    if (options.feature && options.combine) {
        const existStore = fs_1.default.existsSync(`src/redux-store`);
        if (!existStore) {
            console.error(`redux-store does not exist run init command`);
            return;
        }
        (0, feature_1.createCombineAndFeature)(options.feature, options.combine);
        return;
    }
    if (options.feature) {
        const existStore = fs_1.default.existsSync(`src/redux-store`);
        if (!existStore) {
            console.error(`redux-store does not exist run init command`);
            return;
        }
        (0, feature_1.createFeature)(options.feature);
    }
    if (options.version) {
        (0, configs_1.getVersion)();
    }
}
main();
//# sourceMappingURL=main.js.map