import { getPublicGalleryAPIUrl } from "../util";

export async function downloadExtensionById(identifier: string, options: { version: string; recursive: boolean }) {
	let extension = await getPublicGalleryAPIUrl().getExtensionById(identifier);

	if (extension !== undefined) {
		await getPublicGalleryAPIUrl().downloadExtension(extension, options.version);
	}
}
