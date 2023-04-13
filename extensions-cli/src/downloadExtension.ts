import path from "path";
import { getPublicGalleryAPIUrl, versionGroup } from "./util";
import * as fs from "fs";

export async function downloadExtensionById(identifier: string, options: { version: string; recursive: boolean }) {
	let extension = await getPublicGalleryAPIUrl().getExtensionById(identifier);

	if (extension !== undefined) {
		let response = await getPublicGalleryAPIUrl().downloadExtension(extension, options.version);

		const filePath = path.join(__dirname, response.filename);
		fs.writeFile(filePath, response.data, (err) => {
			if (err) {
				console.error(err);
			}
		});

		console.log(`Downloaded ${extension.displayName} to ${filePath}`);
	}
}
