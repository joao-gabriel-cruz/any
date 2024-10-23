"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitChatUseCases = void 0;
const _1 = require(".");
class InitChatUseCases extends _1.ChatUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.InitChatUseCases = InitChatUseCases;
//# sourceMappingURL=init.usecases.js.map