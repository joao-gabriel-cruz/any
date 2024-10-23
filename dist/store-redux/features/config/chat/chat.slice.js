"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackChat = exports.setChat = exports.chatSlice = exports.initialStateChat = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const chat_module_1 = require("./chat.module");
const chat_reducer_1 = require("./reducer/chat.reducer");
exports.initialStateChat = {
    old: null,
    error: "",
    status: "idle",
    data: {},
};
exports.chatSlice = (0, toolkit_1.createSlice)({
    name: "general",
    initialState: exports.initialStateChat,
    reducers: chat_reducer_1.ChatReducer,
    extraReducers: chat_module_1.ChatModule,
});
_a = exports.chatSlice.actions, exports.setChat = _a.setChat, exports.rollbackChat = _a.rollbackChat;
//# sourceMappingURL=chat.slice.js.map