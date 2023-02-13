"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateExtensionProvider = void 0;
const axios_1 = require("axios");
const vscode = require("vscode");
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
        const res = await axios_1.default.get("https://private-extensions.azurewebsites.net/api/extension");
        if (res.status !== axios_1.default.HttpStatusCode.Ok) {
            return [];
        }
        return res.data;
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
        this.tooltip = `${extension.identifier}`;
    }
}
//# sourceMappingURL=privateExtensionProvider.js.map