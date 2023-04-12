import { getPublicGalleryAPIUrl, versionGroup } from "./util";
import * as fs from "fs";

export async function downloadExtensionById(identifier: string, options: { version: string; recursive: boolean }) {
	console.log(`Downloading ${identifier}, ${options.version}, ${options.recursive}...`);

	let extension = await getExtensionDetails(identifier, options.version);
	let response = await getPublicGalleryAPIUrl().downloadExtension(extension);

	fs.writeFileSync(`~/Downloads/${response.filename}`, response.data);
}

async function getExtensionDetails(identifier: string, version: string | undefined) {
	const id = identifier.split(".");
	const publisher = id[0];
	const name = id[1];
	let latestVersion = version;

	if (version === undefined) {
		let extension = await getPublicGalleryAPIUrl().getExtensionById(identifier);
		if (extension !== undefined) {
			latestVersion = version ?? versionGroup(extension.versions!)[0].version.raw;
		}
	}

	return { publisherName: publisher, extensionName: name, version: latestVersion! };
}
