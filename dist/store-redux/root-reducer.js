"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootReducer = void 0;
const theme_slice_1 = require("./features/theme/theme.slice");
const chat_slice_1 = require("./features/config/chat/chat.slice");
const geral_slice_1 = require("./features/config/geral/geral.slice");
exports.rootReducer = {
    theme: theme_slice_1.themeSlice.reducer,
    chat: chat_slice_1.chatSlice.reducer,
    chat: chat_slice_1.chatSlice.reducer,
    geral: geral_slice_1.geralSlice.reducer
};
//# sourceMappingURL=root-reducer.js.map