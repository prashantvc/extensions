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
	let downloadUrl = `${getExtensionSource()}extension/download/${item.identifier}/${item.version}`;
	downloadUrl = flattenUrl(downloadUrl);

	const downloadDirectory = getDownloadDirectory(ctx).fsPath;
	if (!fs.existsSync(downloadDirectory)) {
		fs.mkdirSync(downloadDirectory, { recursive: true });
	}

	const response = await axios.get(downloadUrl, { responseType: "stream" });
	const fileName = getDownloadFilename(response.headers["content-disposition"]);
	if (!fileName) {
		return false;
	}

	const extensionPath = path.join(downloadDirectory, fileName);

	const writer = fs.createWriteStream(extensionPath);
	response.data.pipe(writer);

	await new Promise<void>((resolve, reject) => {
		writer.on("finish", resolve);
		writer.on("error", reject);
	});

	console.log(`Download complete: ${extensionPath}`);

	try {
		await vscode.commands.executeCommand(AppConstants.commandWorkbenchInstall, vscode.Uri.file(extensionPath));
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
	let url = vscode.workspace.getConfiguration("").get<string[]>(AppConstants.configSource);

	return url ? url[0] : "";
}

/**
 * Gets whether to include prerelease versions of private extensions.
 * @returns True if prerelease versions should be included, false otherwise.
 */
export function getPrerelease(): boolean {
	return vscode.workspace.getConfiguration("").get<boolean>(AppConstants.configPrerelease) ?? false;
}

/**
 * Replaces any trailing slashes in the given URL with a single slash.
 * @param {string} url - The URL to flatten.
 * @returns {string} The flattened URL.
 */
export function flattenUrl(url: string) {
	return url.replace(/\/+$/, "/");
}

/**
 * Extracts the file name from the given header string.
 * @param {string} headerString - The header string to extract the file name from.
 * @returns {string | null} The extracted file name, or null if the file name could not be extracted.
 */
function getDownloadFilename(headerString: string): string | null {
	const match = headerString.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
	if (match) {
		const fileName = match[1].replace(/['"]/g, "");
		return decodeURIComponent(fileName);
	}
	return null;
}

export class AppConstants {
	static commandRefresh: string = "private-extensions.refresh";
	static commandSelect: string = "privateExtensions.select";
	static commandAddSource: string = "private-extensions.addSource";
	static commandPrerelease: string = "private-extensions.prerelease";
	static commandInstall: string = "private-extensions.install";
	static commandWorkbenchInstall: string = "workbench.extensions.installExtension";

	static configSource: string = "privateExtensions.Source";
	static configPrerelease: string = "privateExtensions.Prerelease";

	static treeViewId: string = "private-extensions";

	static messageInstall: string = "install";
}
