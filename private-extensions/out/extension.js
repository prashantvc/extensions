"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const privateExtensionProvider_1 = require("./privateExtensionProvider");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    const extensionDataProvider = new privateExtensionProvider_1.PrivateExtensionProvider();
    vscode.window.registerTreeDataProvider("private-extensions", extensionDataProvider);
    let addSource = vscode.commands.registerCommand("private-extensions.addSource", async () => {
        vscode.window
            .showInputBox({
            placeHolder: "Enter the URL of the source",
        })
            .then(async (url) => {
            if (url) {
                vscode.window.showInformationMessage(`Added source ${url}`);
                await vscode.workspace
                    .getConfiguration("")
                    .update("privateExtensions.Source", [url], vscode.ConfigurationTarget.Global);
            }
        });
    });
    vscode.commands.registerCommand("private-extensions.refresh", () => extensionDataProvider.refresh());
    context.subscriptions.push(addSource);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map