import * as vscode from "vscode";
import { ExtensionPackage } from "./extensionPackage";
import { AppConstants, flattenUrl, getExtensionSource } from "./utlis";

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
	};
}

export class ExtensionDetailsPanel {
	public static currentPanel: ExtensionDetailsPanel | undefined;

	public static readonly viewType = "private-extension-details";

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(item: ExtensionPackage, extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		// If we already have a panel, show it.
		if (ExtensionDetailsPanel.currentPanel) {
			ExtensionDetailsPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ExtensionDetailsPanel.viewType,
			item.displayName,
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri)
		);

		ExtensionDetailsPanel.currentPanel = new ExtensionDetailsPanel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		ExtensionDetailsPanel.currentPanel = new ExtensionDetailsPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			(message) => {
				switch (message.command) {
					case AppConstants.messageInstall:
						vscode.commands.executeCommand(AppConstants.commandInstall, message.id);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		ExtensionDetailsPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	public update(item: ExtensionPackage) {
		const webview = this._panel.webview;
		this._panel.title = item.displayName;
		this._panel.webview.html = this._getHtmlForWebview(webview, item);
	}

	private _getHtmlForWebview(webview: vscode.Webview, item: ExtensionPackage) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "markdown-it.min.js"));
		const webviewScript = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "webview.js"));

		// Do the same for the stylesheet
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
		const styleGithub = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "gh.css"));
		const styleMain = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.css"));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();
		const baseUrl = flattenUrl(getExtensionSource());

		return /*html*/ `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleVSCodeUri}" rel="stylesheet">
    <link href="${styleGithub}" rel="stylesheet">
	<link href="${styleMain}" rel="stylesheet">

    <title>${item.displayName}</title>
  </head>
  <body>
 	<table border="0">
			<tr>
				<td rowspan="4">
					<img
						src="${baseUrl}/${item.mainExtension.iconPath}"
						alt="missing-image"
						class="extension-icon"
					/>
				</td>
				<td style="height: 0%"><b>${item.displayName}</b></td>
			</tr>
			<tr>
				<td><span class="identifier">${item.identifier}</span></td>
			</tr>
			<tr>
				<td>${item.description}</td>
			</tr>
			<tr>
				<td><button class="btn-custom" id="installButton" data-extension=${item.identifier}>Install</button></td>
			</tr>
		</table>
<hr />
    <div id="markdownDiv" data-markdown-path="${baseUrl}${item.mainExtension.readmePath}"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
    <script nonce="${nonce}" src="${webviewScript}"></script>
  </body>
</html>
`;
	}
}

function getNonce() {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
