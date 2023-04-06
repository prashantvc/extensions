import axios from "axios";
import * as vscode from "vscode";
import { IExtension } from "./extensionData";
import { ExtensionPackage } from "./extensionPackage";
import { getExtensionSource, getPrerelease } from "./utlis";

export class PrivateExtensionProvider
  implements vscode.TreeDataProvider<ExtensionPackage>
{
  getTreeItem(
    element: ExtensionPackage
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return new ExtensionView(element);
  }
  getChildren(
    element?: ExtensionPackage | undefined
  ): vscode.ProviderResult<ExtensionPackage[]> {
    return this.getExtensionData();
  }

  async getExtensionData(): Promise<ExtensionPackage[]> {
    let url = getExtensionSource();
    if (url === undefined || url === "") {
      return [];
    }

    type Ext = {
      identifier: string;
      version: string;
      extensions: IExtension[];
    };
    const prerelease = getPrerelease();
    const res = await axios.get<Ext[]>(
      `${url}/extension?prerelease=${prerelease}`
    );
    if (res.status !== axios.HttpStatusCode.Ok) {
      return [];
    }

    let responseData = res.data;
    let uniqueExtensions = responseData.reduce((acc: Ext[], curr: Ext) => {
      if (acc.find((p) => p.identifier === curr.identifier)) {
        return acc;
      }
      return [...acc, curr];
    }, []);

    const localExtensions = uniqueExtensions.map(
      (p) => new ExtensionPackage(p.identifier, p.version, p.extensions)
    );

    return localExtensions;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    ExtensionPackage | undefined | null | void
  > = new vscode.EventEmitter<ExtensionPackage | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ExtensionPackage | undefined | null | void
  > = this._onDidChangeTreeData.event;
}

class ExtensionView extends vscode.TreeItem {
  constructor(public readonly extension: ExtensionPackage) {
    super(extension.displayName, vscode.TreeItemCollapsibleState.None);
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
