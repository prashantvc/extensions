// To parse this data:
//
//   import { Convert, Package } from "./file";
//
//   const package = Convert.toPackage(json);

export interface IExtension {
    metadata: Metadata;
    assets: Asset[];
    identifier: string;
    isPreRelease: boolean;
    version: string;
    target: string;
    categories: string[];
    displayName: string;
    description: string;
    relativeIconPath: string;
    relativeReadmePath: string;
}

export class Extension {
    constructor(extensionPackage: IExtension) {
        this.extension = extensionPackage;
    }
    public get packagePath(): string {
        var packagePath = `${this.extensionPath}.vsix`
        return packagePath;
    }
    public get iconPath(): string {
        let path = this.extension.relativeIconPath;
        if (path === undefined || path === null) {
            return "default_icon_128.png";
        }

        var iconPath = `${this.extensionPath}/${path}`;
        return iconPath;
    }
    public get readmePath(): string {
        let path = this.extension.relativeReadmePath;
        return this.extensionPath + "/" + path;
    }
    get extensionPath(): string {
        var extensionPath = (this.extension.metadata.identity.targetPlatform !== null) ?
            `output/${this.extension.identifier}-${this.extension.version}@${this.extension.metadata.identity.targetPlatform}` :
            `output/${this.extension.identifier}-${this.extension.version}`

        return extensionPath;
    }
    extension: IExtension
}

export interface Asset {
    assetType: string;
    path: string;
}

export interface Metadata {
    identity: Identity;
    displayName: string;
    categoryString: string;
    categories: string[];
    description: string;
}

export interface Identity {
    language: string;
    id: string;
    version: string;
    publisher: string;
    targetPlatform: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toPackage(json: string): IExtension {
        return JSON.parse(json);
    }

    public static packageToJson(value: IExtension): string {
        return JSON.stringify(value);
    }
}
