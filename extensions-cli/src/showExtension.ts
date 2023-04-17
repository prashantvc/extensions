import { getPublicGalleryAPIUrl, versionGroup } from "./util";
import { VSCodePublishedExtension } from "./service/galleryapi";

export async function showExtension(identifier: string) {
	const extension = await getPublicGalleryAPIUrl().getExtensionById(identifier);
	if (extension !== undefined) {
		printExtensionDetails(extension);
	} else {
		console.error(`Extension not found: ${identifier}`);
	}
}

function printExtensionDetails(ext: VSCodePublishedExtension) {
	console.log(`${ext.displayName} - ${ext.publisher.publisherName}.${ext.extensionName}`);
	console.log(`${ext.shortDescription}`);
	console.log(`\nPublisher: ${ext.publisher.displayName}`);
	console.log(
		`Updated: ${ext.lastUpdated?.toLocaleDateString()}, Published: ${ext.publishedDate?.toLocaleDateString()}`
	);

	//print latest version
	const vrs = versionGroup(ext.versions!);
	console.log(`Latest version: ${vrs[0].version}`);
}
