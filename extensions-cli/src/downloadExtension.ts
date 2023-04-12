import { getPublicGalleryAPIUrl } from "./util";

export async function downloadExtensionById(identifier: string, recursive: boolean = true) {
	let extension = await getPublicGalleryAPIUrl().getExtensionById(identifier);
	if (extension !== undefined) {
		getPublicGalleryAPIUrl().downloadExtension(extension, "");
	}
}
