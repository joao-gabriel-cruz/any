"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackTheme = exports.setTheme = exports.themeSlice = exports.initialStateTheme = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const theme_module_1 = require("./theme.module");
const theme_reducer_1 = require("./reducer/theme.reducer");
exports.initialStateTheme = {
    old: null,
    error: "",
    status: "idle",
    data: {},
};
exports.themeSlice = (0, toolkit_1.createSlice)({
    name: "general",
    initialState: exports.initialStateTheme,
    reducers: theme_reducer_1.ThemeReducer,
    extraReducers: theme_module_1.ThemeModule,
});
_a = exports.themeSlice.actions, exports.setTheme = _a.setTheme, exports.rollbackTheme = _a.rollbackTheme;
//# sourceMappingURL=theme.slice.js.map