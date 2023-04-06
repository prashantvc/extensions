import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

import { ExtensionPackage } from "./extensionPackage";

export async function installExtension(
  item: ExtensionPackage,
  ctx: vscode.ExtensionContext
): Promise<boolean> {
  console.log(`Installing ${item.displayName}`);
  const downloadUrl = `${getExtensionSource()}/extension/download/${
    item.identifier
  }/${item.version}`;

  const downloadDirectory = getDownloadDirectory(ctx).fsPath;
  if (!fs.existsSync(downloadDirectory)) {
    fs.mkdirSync(downloadDirectory, { recursive: true });
  }
  const response = await axios.get(downloadUrl, { responseType: "stream" });
  const fileName = `${item.identifier}-${item.version}.vsix`;
  const extensionPath = path.join(downloadDirectory, fileName);

  const writer = fs.createWriteStream(extensionPath);
  response.data.pipe(writer);

  return new Promise<boolean>((resolve, reject) => {
    writer.on("finish", () => {
      console.log(`Download complete: ${extensionPath}`);
      vscode.commands
        .executeCommand(
          "workbench.extensions.installExtension",
          vscode.Uri.file(extensionPath)
        )
        .then(() => {
          console.log(`Installed ${item.displayName}`);
          fs.rmSync(extensionPath);
          resolve(true);
        });
    });
    writer.on("error", (error) => {
      console.error(error);
      resolve(false);
    });
  });
}

function getDownloadDirectory(ctx: vscode.ExtensionContext): vscode.Uri {
  return vscode.Uri.joinPath(ctx.globalStorageUri, "temp");
}

export function getExtensionSource(): string {
  let url = vscode.workspace
    .getConfiguration("")
    .get<string[]>("privateExtensions.Source");

  return url ? url[0] : "";
}

export function getPrerelease(): boolean {
  return (
    vscode.workspace
      .getConfiguration("")
      .get<boolean>("privateExtensions.Prerelease") ?? false
  );
}
