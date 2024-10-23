"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = exports.useAppSelector = exports.useAppDispatch = void 0;
const react_redux_1 = require("react-redux");
// Use throughout your app instead of plain "useDispatch" and "useSelector"
exports.useAppDispatch = react_redux_1.useDispatch.withTypes();
exports.useAppSelector = react_redux_1.useSelector.withTypes();
exports.useAppStore = react_redux_1.useStore.withTypes();
//# sourceMappingURL=index.js.map