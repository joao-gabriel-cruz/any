"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const chat_slice_1 = require("./chat/chat.slice");
const geral_slice_1 = require("./geral/geral.slice");
exports.configSlice = (0, toolkit_1.combineSlices)(chat_slice_1.chatSlice, geral_slice_1.geralSlice);
//# sourceMappingURL=config.slice.js.map