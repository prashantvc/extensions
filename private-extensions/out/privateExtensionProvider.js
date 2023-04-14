"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateExtensionProvider = void 0;
const axios_1 = require("axios");
const vscode = require("vscode");
const extensionPackage_1 = require("./extensionPackage");
const utlis_1 = require("./utlis");
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
        let url = (0, utlis_1.getExtensionSource)();
        if (url === undefined || url === "") {
            return [];
        }
        const prerelease = (0, utlis_1.getPrerelease)();
        url = (0, utlis_1.flattenUrl)(`${url}extension?prerelease=${prerelease}`);
        const res = await axios_1.default.get(url);
        if (res.status !== axios_1.default.HttpStatusCode.Ok) {
            return [];
        }
        let responseData = res.data;
        let uniqueExtensions = responseData.reduce((acc, curr) => {
            if (acc.find((p) => p.identifier === curr.identifier)) {
                return acc;
            }
            return [...acc, curr];
        }, []);
        const localExtensions = uniqueExtensions.map((p) => new extensionPackage_1.ExtensionPackage(p.identifier, p.version, p.extensions));
        return localExtensions;
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
        this.id = extension.identifier;
        this.description = `v${extension.version}`;
        this.tooltip = extension.description;
        this.iconPath = new vscode.ThemeIcon("extensions");
        this.command = {
            command: "private-extensions.select",
            title: "",
            arguments: [extension],
        };
    }
}
//# sourceMappingURL=privateExtensionProvider.js.map