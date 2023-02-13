"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
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
    context.subscriptions.push(addSource);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map