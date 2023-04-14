import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

import { ExtensionPackage } from "./extensionPackage";

/**
 * Downloads an extension package from the specified source and saves it to the download directory.
 * @param item The extension package to download.
 * @param ctx The extension context.
 * @returns A promise that resolves to true if the download is successful, or false if there's an error.
 */
export async function installExtension(item: ExtensionPackage, ctx: vscode.ExtensionContext): Promise<boolean> {
	console.log(`Installing ${item.displayName}`);
	const downloadUrl = `${getExtensionSource()}/extension/download/${item.identifier}/${item.version}`;

	const downloadDirectory = getDownloadDirectory(ctx).fsPath;
	if (!fs.existsSync(downloadDirectory)) {
		fs.mkdirSync(downloadDirectory, { recursive: true });
	}

	const response = await axios.get(downloadUrl, { responseType: "stream" });
	const fileName = `${item.identifier}-${item.version}.vsix`;
	const extensionPath = path.join(downloadDirectory, fileName);

	const writer = fs.createWriteStream(extensionPath);
	response.data.pipe(writer);

	await new Promise<void>((resolve, reject) => {
		writer.on("finish", resolve);
		writer.on("error", reject);
	});

	console.log(`Download complete: ${extensionPath}`);

	try {
		await vscode.commands.executeCommand("workbench.extensions.installExtension", vscode.Uri.file(extensionPath));
		console.log(`Installed ${item.displayName}`);
		fs.rmSync(extensionPath);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Gets the download directory for the extension.
 * @param ctx The extension context.
 * @returns A URI representing the download directory.
 */
function getDownloadDirectory(ctx: vscode.ExtensionContext): vscode.Uri {
	return vscode.Uri.joinPath(ctx.globalStorageUri, "temp");
}

/**
 * Gets the source URL for private extensions.
 * @returns The source URL for private extensions.
 */
export function getExtensionSource(): string {
	let url = vscode.workspace.getConfiguration("").get<string[]>("privateExtensions.Source");

	return url ? url[0] : "";
}

/**
 * Gets whether to include prerelease versions of private extensions.
 * @returns True if prerelease versions should be included, false otherwise.
 */
export function getPrerelease(): boolean {
	return vscode.workspace.getConfiguration("").get<boolean>("privateExtensions.Prerelease") ?? false;
}

export function flattenUrl(url: string) {
	return url.replace(/\/+$/, "");
}
