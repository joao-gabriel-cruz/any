"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitGeralUseCases = void 0;
const _1 = require(".");
class InitGeralUseCases extends _1.GeralUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.InitGeralUseCases = InitGeralUseCases;
//# sourceMappingURL=init.usecases.js.map