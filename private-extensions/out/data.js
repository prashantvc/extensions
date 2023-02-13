"use strict";
// To parse this data:
//
//   import { Convert, Extension } from "./file";
//
//   const extension = Convert.toExtension(json);
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
// Converts JSON strings to/from your types
class Convert {
    static toExtension(json) {
        return JSON.parse(json);
    }
    static extensionToJson(value) {
        return JSON.stringify(value);
    }
}
exports.Convert = Convert;
//# sourceMappingURL=data.js.map