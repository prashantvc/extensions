"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const privateExtensionProvider_1 = require("./privateExtensionProvider");
const console_1 = require("console");
const extensionDetailsPanel_1 = require("./extensionDetailsPanel");
const utlis_1 = require("./utlis");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    const extensionDataProvider = new privateExtensionProvider_1.PrivateExtensionProvider();
    vscode.window.registerTreeDataProvider(utlis_1.AppConstants.treeViewId, extensionDataProvider);
    let addSource = vscode.commands.registerCommand(utlis_1.AppConstants.commandAddSource, async () => {
        vscode.window
            .showInputBox({
            placeHolder: "Enter the repository URL",
        })
            .then(async (url) => {
            if (url) {
                vscode.window.showInformationMessage(`Added source ${url}`);
                await vscode.workspace
                    .getConfiguration("")
                    .update(utlis_1.AppConstants.configSource, [url], vscode.ConfigurationTarget.Global);
                extensionDataProvider.refresh();
            }
        });
    });
    let enablePrerelease = vscode.commands.registerCommand(utlis_1.AppConstants.commandPrerelease, async () => {
        await vscode.workspace
            .getConfiguration("")
            .update(utlis_1.AppConstants.configPrerelease, !vscode.workspace.getConfiguration("").get(utlis_1.AppConstants.configPrerelease), vscode.ConfigurationTarget.Global);
        extensionDataProvider.refresh();
    });
    vscode.commands.registerCommand(utlis_1.AppConstants.commandRefresh, () => extensionDataProvider.refresh());
    vscode.commands.registerCommand(utlis_1.AppConstants.commandSelect, (item) => {
        (0, console_1.log)(`Selected ${item.identifier} - v${item.version}...`);
        extensionDetailsPanel_1.ExtensionDetailsPanel.createOrShow(item, context.extensionUri);
        extensionDetailsPanel_1.ExtensionDetailsPanel.currentPanel?.update(item);
    });
    vscode.commands.registerCommand(utlis_1.AppConstants.commandInstall, async (item) => {
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
        if (e.affectsConfiguration(utlis_1.AppConstants.configPrerelease)) {
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
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media"), vscode.Uri.joinPath(extensionUri, "out")],
    };
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map