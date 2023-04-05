// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
import * as vscode from "vscode";
import { PrivateExtensionProvider } from "./privateExtensionProvider";
import { log } from "console";

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
                    placeHolder: "Enter the repository URL",
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
                        extensionDataProvider.refresh();
                    }
                });
        }
    );

    vscode.commands.registerCommand("private-extensions.refresh", () =>
        extensionDataProvider.refresh()
    );

    vscode.commands.registerCommand("private-extensions.select", (item) => {
        log(`Selected ${item.identifier} - v${item.version}...`);
    });

    vscode.commands.registerCommand("private-extensions.install", (item) => {
        log(`Installing ${item.identifier}...`);
    });

    context.subscriptions.push(addSource);
}

// This method is called when your extension is deactivated
export function deactivate() {}
