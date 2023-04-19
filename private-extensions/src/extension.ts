// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { PrivateExtensionProvider } from "./privateExtensionProvider";
import { log } from "console";
import { ExtensionDetailsPanel } from "./extensionDetailsPanel";
import { ExtensionPackage } from "./extensionPackage";
import { AppConstants, installExtension } from "./utlis";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const extensionDataProvider = new PrivateExtensionProvider();
	vscode.window.registerTreeDataProvider(AppConstants.treeViewId, extensionDataProvider);

	let addSource = vscode.commands.registerCommand(AppConstants.commandAddSource, async () => {
		vscode.window
			.showInputBox({
				placeHolder: "Enter the repository URL",
			})
			.then(async (url) => {
				if (url) {
					vscode.window.showInformationMessage(`Added source ${url}`);
					await vscode.workspace
						.getConfiguration("")
						.update(AppConstants.configSource, [url], vscode.ConfigurationTarget.Global);
					extensionDataProvider.refresh();
				}
			});
	});

	let enablePrerelease = vscode.commands.registerCommand(AppConstants.commandPrerelease, async () => {
		await vscode.workspace
			.getConfiguration("")
			.update(
				AppConstants.configPrerelease,
				!vscode.workspace.getConfiguration("").get(AppConstants.configPrerelease),
				vscode.ConfigurationTarget.Global
			);
		extensionDataProvider.refresh();
	});

	vscode.commands.registerCommand(AppConstants.commandRefresh, () => extensionDataProvider.refresh());

	vscode.commands.registerCommand(AppConstants.commandSelect, (item: ExtensionPackage) => {
		log(`Selected ${item.identifier} - v${item.version}...`);
		ExtensionDetailsPanel.createOrShow(item, context.extensionUri);
		ExtensionDetailsPanel.currentPanel?.update(item);
	});

	vscode.commands.registerCommand(AppConstants.commandInstall, async (item: ExtensionPackage) => {
		await installExtension(item, context);
	});

	context.subscriptions.push(addSource);
	context.subscriptions.push(enablePrerelease);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(ExtensionDetailsPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				ExtensionDetailsPanel.revive(webviewPanel, context.extensionUri);
			},
		});
	}

	vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration(AppConstants.configPrerelease)) {
			extensionDataProvider.refresh();
		}
	});
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media"), vscode.Uri.joinPath(extensionUri, "out")],
	};
}

// This method is called when your extension is deactivated
export function deactivate() {}
