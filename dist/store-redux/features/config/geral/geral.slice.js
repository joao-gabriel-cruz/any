"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackGeral = exports.setGeral = exports.geralSlice = exports.initialStateGeral = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const geral_module_1 = require("./geral.module");
const geral_reducer_1 = require("./reducer/geral.reducer");
exports.initialStateGeral = {
    old: null,
    error: "",
    status: "idle",
    data: {},
};
exports.geralSlice = (0, toolkit_1.createSlice)({
    name: "general",
    initialState: exports.initialStateGeral,
    reducers: geral_reducer_1.GeralReducer,
    extraReducers: geral_module_1.GeralModule,
});
_a = exports.geralSlice.actions, exports.setGeral = _a.setGeral, exports.rollbackGeral = _a.rollbackGeral;
//# sourceMappingURL=geral.slice.js.map