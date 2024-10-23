"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeralExtraReducers = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
class GeralExtraReducers {
}
exports.GeralExtraReducers = GeralExtraReducers;
_a = GeralExtraReducers;
GeralExtraReducers.init = (0, toolkit_1.createAsyncThunk)("geral/init", () => __awaiter(void 0, void 0, void 0, function* () {
    const result = new Promise((resolve) => {
        setTimeout(() => {
            resolve({});
        }, 1000);
    });
    return result;
}));
GeralExtraReducers.save = (0, toolkit_1.createAsyncThunk)("geral/save", () => __awaiter(void 0, void 0, void 0, function* () {
    const result = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
    return result;
}));
//# sourceMappingURL=geral-extra.reducer.js.map