"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStore = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const root_reducer_1 = require("./root-reducer");
const makeStore = () => {
    return (0, toolkit_1.configureStore)({
        reducer: root_reducer_1.rootReducer,
    });
};
exports.makeStore = makeStore;
//# sourceMappingURL=store.js.map