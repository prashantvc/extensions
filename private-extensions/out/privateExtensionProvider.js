"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateExtensionProvider = void 0;
const axios_1 = require("axios");
const vscode = require("vscode");
const data_1 = require("./data");
class PrivateExtensionProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getTreeItem(element) {
        return new ExtensionView(element);
    }
    getChildren(element) {
        return this.getExtensionData();
    }
    async getExtensionData() {
        let url = getExtensionSource();
        if (url === undefined || url === "") {
            return [];
        }
        const res = await axios_1.default.get(`${url}/extension`);
        if (res.status !== axios_1.default.HttpStatusCode.Ok) {
            return [];
        }
        let packages = res.data.map(p => new data_1.PackageWrapper(p));
        return packages;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.PrivateExtensionProvider = PrivateExtensionProvider;
class ExtensionView extends vscode.TreeItem {
    constructor(extension) {
        super(extension.displayName, vscode.TreeItemCollapsibleState.None);
        this.extension = extension;
        this.id = extension.extensionPackage.identifier;
        this.tooltip = `${extension.extensionPackage.identifier} - ${extension.extensionPackage.version}`;
        this.description = extension.description;
    }
}
function getExtensionSource() {
    let url = vscode.workspace
        .getConfiguration("").get("privateExtensions.Source");
    return (url) ? url[0] : "";
}
//# sourceMappingURL=privateExtensionProvider.js.map