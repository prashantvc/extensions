import axios from "axios";
import * as vscode from "vscode";
import { IPackage, PackageWrapper } from "./data";

export class PrivateExtensionProvider implements vscode.TreeDataProvider<PackageWrapper> {
    getTreeItem(element: PackageWrapper): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return new ExtensionView(element);
    }
    getChildren(element?: PackageWrapper | undefined): vscode.ProviderResult<PackageWrapper[]> {
        return this.getExtensionData();
    }

    async getExtensionData(): Promise<PackageWrapper[]> {

        let url = getExtensionSource();
        if (url === undefined || url === "") {
            return [];
        }
    
        const res = await axios.get<IPackage[]>(`${url}/extension`);
        if (res.status !== axios.HttpStatusCode.Ok) {
            return [];
        }

        let packages = res.data.map(p => new PackageWrapper(p));
        return packages;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
    PackageWrapper | undefined | null | void
    > = new vscode.EventEmitter<PackageWrapper | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PackageWrapper | undefined | null | void> =
        this._onDidChangeTreeData.event;
}

class ExtensionView extends vscode.TreeItem {
    constructor(public readonly extension: PackageWrapper) {
        super(extension.displayName, vscode.TreeItemCollapsibleState.None);
        this.id = extension.extensionPackage.identifier;
        this.tooltip = `${extension.extensionPackage.identifier} - ${extension.extensionPackage.version}`;
        this.description = extension.description;
    }
}

function getExtensionSource(): string {
    let url = vscode.workspace
        .getConfiguration("").get<string[]>("privateExtensions.Source");
    
    return (url) ? url[0] : "";
}