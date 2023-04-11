import { Extension, IExtension } from "./extension";

export class ExtensionPackage {
	identifier: string;
	private _version: string;
	extensions: Extension[];

	constructor(identifier: string, version: string, extensions: IExtension[]) {
		this.identifier = identifier;
		this._version = version;
		this.extensions = extensions.map((p) => new Extension(p));
	}

	public get version(): string {
		return this._version ?? this.mainExtension.extension.version;
	}

	public get mainExtension(): Extension {
		return this.extensions[0];
	}

	public get displayName(): string {
		return this.mainExtension.extension.displayName;
	}

	public get description(): string {
		return this.mainExtension.extension.description;
	}

	public extention(version: string, target: string | undefined = undefined): Extension | undefined {
		if (target !== undefined) {
			let exts = this.extensions.find((p) => p.extension.version === version && p.extension.target === target);

			return exts === undefined ? undefined : exts;
		}

		let payload = this.extensions.find((p) => p.extension.version === version);
		return payload === undefined ? undefined : payload;
	}

	public get versions(): string[] {
		return this.extensions.map((p) => p.extension.version);
	}

	public get uniqueVersions(): string[] {
		let versions = this.extensions.map((p) => p.extension.version);
		return versions.filter((v, i, a) => a.indexOf(v) === i);
	}

	public get targets(): string[] {
		return this.extensions
			.filter((p) => p.extension.metadata.identity.targetPlatform !== null)
			.map((p) => p.extension.metadata.identity.targetPlatform);
	}
}
