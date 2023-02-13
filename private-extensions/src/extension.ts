// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
import * as vscode from "vscode";
import { Data } from "./data";
import { PrivateExtensionProvider } from "./privateExtensionProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const extensionDataProvider = new PrivateExtensionProvider();
    vscode.window.registerTreeDataProvider(
        "private-extensions",
        extensionDataProvider
    );

    let addSource = vscode.commands.registerCommand(
        "private-extensions.addSource",
        async () => {
            vscode.window
                .showInputBox({
                    placeHolder: "Enter the URL of the source",
                })
                .then(async (url) => {
                    if (url) {
                        vscode.window.showInformationMessage(
                            `Added source ${url}`
                        );
                        await vscode.workspace
                            .getConfiguration("")
                            .update(
                                "privateExtensions.Source",
                                [url],
                                vscode.ConfigurationTarget.Global
                            );
                    }
                });
        }
    );

    vscode.commands.registerCommand("private-extensions.refresh", () =>
        extensionDataProvider.refresh()
    );

    context.subscriptions.push(addSource);
}

// This method is called when your extension is deactivated
export function deactivate() {}
