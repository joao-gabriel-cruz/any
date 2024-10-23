"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveChatUseCases = void 0;
const _1 = require(".");
class SaveChatUseCases extends _1.ChatUseCases {
    fulfilled(state) {
        state.status = "succeeded";
        state.error = "";
        state.old = null;
    }
}
exports.SaveChatUseCases = SaveChatUseCases;
//# sourceMappingURL=save.usecases.js.map