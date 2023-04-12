import { ExtensionVersion } from "azure-devops-node-api/interfaces/GalleryInterfaces";
import { getPublicGalleryAPIUrl } from "./util";
import * as semver from "semver";
import { VSCodePublishedExtension } from "./galleryapi";

export interface ExtensionVersionGroup {
	readonly version: semver.SemVer;
	readonly details: { version: string; lastUpdated: Date; targetPlatform: string | undefined }[];
}

export async function showExtension(identifier: string) {
	const extension = await getPublicGalleryAPIUrl().getExtensionById(identifier);
	if (extension !== undefined) {
		printExtensionDetails(extension);
	} else {
		console.error(`Extension not found: ${identifier}`);
	}
}

function printExtensionDetails(ext: VSCodePublishedExtension) {
	const vrs = groupVersionsByVersionString(ext.versions!);
	console.log(`${ext.displayName} - ${ext.publisher.publisherName}.${ext.extensionName}`);
	console.log(`${ext.shortDescription}`);
	console.log(`\nPublisher: ${ext.publisher.displayName}`);
	console.log(
		`Updated: ${ext.lastUpdated?.toLocaleDateString()}, Published: ${ext.publishedDate?.toLocaleDateString()}`
	);

	//print latest version
	console.log(`Latest version: ${vrs[0].version}`);
}

function groupVersionsByVersionString(versionList: ExtensionVersion[], maxVersions = 5) {
	const versionsByNumber = versionList.reduce((acc, version) => {
		const versionString = version.version!;
		if (!acc[versionString]) {
			acc[versionString] = [];
		}
		acc[versionString].push({
			version: version.version!,
			lastUpdated: version.lastUpdated!,
			targetPlatform: version.targetPlatform,
		});
		return acc;
	}, {} as { [version: string]: { version: string; lastUpdated: Date; targetPlatform: string | undefined }[] });

	const versionGroup = Object.keys(versionsByNumber)
		.map((v) => {
			return {
				version: new semver.SemVer(v),
				details: versionsByNumber[v],
			} as ExtensionVersionGroup;
		})
		.sort((a, b) => {
			return semver.compare(b.version!, a.version!);
		})
		.slice(0, maxVersions);

	return versionGroup;
}
