"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const privateExtensionProvider_1 = require("./privateExtensionProvider");
const console_1 = require("console");
const extensionDetailsPanel_1 = require("./extensionDetailsPanel");
const utlis_1 = require("./utlis");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    const extensionDataProvider = new privateExtensionProvider_1.PrivateExtensionProvider();
    vscode.window.registerTreeDataProvider("private-extensions", extensionDataProvider);
    let addSource = vscode.commands.registerCommand("private-extensions.addSource", async () => {
        vscode.window
            .showInputBox({
            placeHolder: "Enter the repository URL",
        })
            .then(async (url) => {
            if (url) {
                vscode.window.showInformationMessage(`Added source ${url}`);
                await vscode.workspace
                    .getConfiguration("")
                    .update("privateExtensions.Source", [url], vscode.ConfigurationTarget.Global);
                extensionDataProvider.refresh();
            }
        });
    });
    let enablePrerelease = vscode.commands.registerCommand("private-extensions.prerelease", async () => {
        await vscode.workspace
            .getConfiguration("")
            .update("privateExtensions.Prerelease", !vscode.workspace
            .getConfiguration("")
            .get("privateExtensions.Prerelease"), vscode.ConfigurationTarget.Global);
        extensionDataProvider.refresh();
    });
    vscode.commands.registerCommand("private-extensions.refresh", () => extensionDataProvider.refresh());
    vscode.commands.registerCommand("private-extensions.select", (item) => {
        (0, console_1.log)(`Selected ${item.identifier} - v${item.version}...`);
        extensionDetailsPanel_1.ExtensionDetailsPanel.createOrShow(item, context.extensionUri);
        extensionDetailsPanel_1.ExtensionDetailsPanel.currentPanel?.update(item);
    });
    vscode.commands.registerCommand("private-extensions.install", async (item) => {
        await (0, utlis_1.installExtension)(item, context);
    });
    context.subscriptions.push(addSource);
    context.subscriptions.push(enablePrerelease);
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(extensionDetailsPanel_1.ExtensionDetailsPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel, state) {
                console.log(`Got state: ${state}`);
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
                extensionDetailsPanel_1.ExtensionDetailsPanel.revive(webviewPanel, context.extensionUri);
            },
        });
    }
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("privateExtensions.Prerelease")) {
            extensionDataProvider.refresh();
        }
    });
}
exports.activate = activate;
function getWebviewOptions(extensionUri) {
    return {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
    };
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map