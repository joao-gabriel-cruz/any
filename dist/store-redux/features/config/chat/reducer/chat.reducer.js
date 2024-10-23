"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatReducer = void 0;
const ChatReducer = () => {
    const rollbackChat = (state) => {
        if (state === null || state === void 0 ? void 0 : state.old) {
            state.data = state.old;
        }
        state.old = null;
    };
    return {
        rollbackChat,
    };
};
exports.ChatReducer = ChatReducer;
//# sourceMappingURL=chat.reducer.js.map