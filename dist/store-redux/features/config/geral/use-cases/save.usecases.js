"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveGeralUseCases = void 0;
const _1 = require(".");
class SaveGeralUseCases extends _1.GeralUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.SaveGeralUseCases = SaveGeralUseCases;
//# sourceMappingURL=save.usecases.js.map