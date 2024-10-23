"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = exports.saveChat = exports.initChat = void 0;
const save_usecases_1 = require("./use-cases/save.usecases");
const init_usecases_1 = require("../chat/use-cases/init.usecases");
const redux_1 = require("../../../../utils/redux/redux");
const chat_extra_reducer_1 = require("./reducer/chat-extra.reducer");
exports.initChat = chat_extra_reducer_1.ChatExtraReducers.init;
exports.saveChat = chat_extra_reducer_1.ChatExtraReducers.save;
const init = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new init_usecases_1.InitChatUseCases(),
    extraReducers: exports.initChat,
});
const save = (0, redux_1.combineUseCasesWithExtraReducers)({
    useCase: new save_usecases_1.SaveChatUseCases(),
    extraReducers: exports.saveChat,
});
const ChatModule = (builder) => {
    builder.addCase(init.fulfilled.extra, init.fulfilled.useCase);
    builder.addCase(init.pending.extra, init.pending.useCase);
    builder.addCase(init.rejected.extra, init.rejected.useCase);
    builder.addCase(save.fulfilled.extra, save.fulfilled.useCase);
    builder.addCase(save.pending.extra, save.pending.useCase);
    builder.addCase(save.rejected.extra, save.rejected.useCase);
};
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map