import axios from "axios";
import * as vscode from "vscode";
import { Data } from "./data";

export class PrivateExtensionProvider implements vscode.TreeDataProvider<Data> {
    getTreeItem(element: Data): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return new ExtensionView(element);
    }
    getChildren(element?: Data | undefined): vscode.ProviderResult<Data[]> {
        return this.getExtensionData();
    }

    async getExtensionData(): Promise<Data[]> {
        const res = await axios.get<Data[]>(
            "https://private-extensions.azurewebsites.net/api/extension"
        );

        if (res.status !== axios.HttpStatusCode.Ok) {
            return [];
        }

        return res.data;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
        Data | undefined | null | void
    > = new vscode.EventEmitter<Data | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Data | undefined | null | void> =
        this._onDidChangeTreeData.event;
}

class ExtensionView extends vscode.TreeItem {
    constructor(public readonly extension: Data) {
        super(extension.displayName, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `${extension.identifier}`;
    }
}
