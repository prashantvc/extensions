import { GalleryApi } from "./galleryapi";

const marketplaceUrl = "https://marketplace.visualstudio.com/_apis/public/gallery";

export function getPublicGalleryAPIUrl() {
	return new GalleryApi(marketplaceUrl, "3.0-preview.1");
}
