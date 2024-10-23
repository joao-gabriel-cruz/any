"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackBatata = exports.setBatata = exports.batataSlice = exports.initialStateBatata = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const batata_module_1 = require("./batata.module");
const batata_reducer_1 = require("./reducer/batata.reducer");
exports.initialStateBatata = {
    old: null,
    error: "",
    status: "idle",
    data: {},
};
exports.batataSlice = (0, toolkit_1.createSlice)({
    name: "general",
    initialState: exports.initialStateBatata,
    reducers: batata_reducer_1.BatataReducer,
    extraReducers: batata_module_1.BatataModule,
});
_a = exports.batataSlice.actions, exports.setBatata = _a.setBatata, exports.rollbackBatata = _a.rollbackBatata;
//# sourceMappingURL=batata.slice.js.map