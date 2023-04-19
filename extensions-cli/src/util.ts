import { GalleryApi, VSCodePublishedExtension } from "./service/galleryapi";
import { ExtensionVersion } from "azure-devops-node-api/interfaces/GalleryInterfaces";
import * as semver from "semver";

const marketplaceUrl = "https://marketplace.visualstudio.com/_apis/public/gallery";

export function getPublicGalleryAPIUrl() {
	return new GalleryApi(marketplaceUrl, "3.0-preview.1");
}

export function versionGroup(versionList: ExtensionVersion[], maxVersions = 5): ExtensionVersionGroup[] {
	const versionsByNumber = versionList.reduce((acc, version) => {
		const versionString = version.version!;
		if (!acc[versionString]) {
			acc[versionString] = [];
		}
		acc[versionString].push({
			version: version.version!,
			lastUpdated: version.lastUpdated!,
			targetPlatform: version.targetPlatform,
			assetUrl: `${version.assetUri!}/Microsoft.VisualStudio.Services.VSIXPackage`,
		});
		return acc;
	}, {} as { [version: string]: VersionDetails[] });

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

export function getLatestExtensionVersion(
	ext: VSCodePublishedExtension,
	version: string | undefined
): ExtensionVersionGroup {
	let versions = versionGroup(ext.versions!);
	if (version === undefined) {
		return versions[0];
	} else {
		return versions.find((v) => v.version.raw === version) ?? versions[0];
	}
}

export interface VersionDetails {
	version: string;
	lastUpdated: Date;
	targetPlatform: string | undefined;
	assetUrl: string;
}
export interface ExtensionVersionGroup {
	readonly version: semver.SemVer;
	readonly details: VersionDetails[];
}
