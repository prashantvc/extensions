"use strict";
// To parse this data:
//
//   import { Convert, Package } from "./file";
//
//   const package = Convert.toPackage(json);
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = exports.PackageWrapper = void 0;
class PackageWrapper {
    constructor(extensionPackage) {
        this.extensionPackage = extensionPackage;
    }
    get displayName() {
        return this.extensionPackage.metadata.displayName;
    }
    get description() {
        return this.extensionPackage.metadata.description;
    }
    get packagePath() {
        var packagePath = `${this.extensionPath()}.vsix`;
        return packagePath;
    }
    get iconPath() {
        let path = this.extensionPackage.assets.find(a => a.assetType === "Microsoft.VisualStudio.Services.Icons.Default")?.path;
        if (path === undefined || path === null) {
            return "favicon.ico";
        }
        var iconPath = `${this.extensionPath()}/${path}`;
        return iconPath;
    }
    extensionPath() {
        var extensionPath = (this.extensionPackage.metadata.identity.targetPlatform !== null) ?
            `output/${this.extensionPackage.identifier}-${this.extensionPackage.version}@${this.extensionPackage.metadata.identity.targetPlatform}` :
            `output/${this.extensionPackage.identifier}-${this.extensionPackage.version}`;
        return extensionPath;
    }
}
exports.PackageWrapper = PackageWrapper;
// Converts JSON strings to/from your types
class Convert {
    static toPackage(json) {
        return JSON.parse(json);
    }
    static packageToJson(value) {
        return JSON.stringify(value);
    }
}
exports.Convert = Convert;
//# sourceMappingURL=data.js.map