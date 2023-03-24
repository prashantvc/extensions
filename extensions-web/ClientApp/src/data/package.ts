// To parse this data:
//
//   import { Convert, Package } from "./file";
//
//   const package = Convert.toPackage(json);

export interface IPackage {
    metadata: Metadata;
    assets: Asset[];
    identifier: string;
    isPreRelease: boolean;
    version: string;
}

export class PackageWrapper {
    constructor(extensionPackage: IPackage) {
        this.extensionPackage = extensionPackage;
    }

    public get displayName(): string {
        return this.extensionPackage.metadata.displayName;
    }
    public get description(): string {
        return this.extensionPackage.metadata.description;
    }

    public get packagePath(): string {
        var packagePath = `${this.extensionPath}.vsix`
        return packagePath;
    }

    public get iconPath(): string {
        let path = this.extensionPackage.assets.find(a => a.assetType === "Microsoft.VisualStudio.Services.Icons.Default")?.path;

        if (path === undefined || path === null) {
            return "favicon.ico";
        }

        var iconPath = `${this.extensionPath}/${path}`;
        return iconPath;
    }

    public get extensionPath(): string {
        var extensionPath = (this.extensionPackage.metadata.identity.targetPlatform !== null) ?
            `output/${this.extensionPackage.identifier}-${this.extensionPackage.version}@${this.extensionPackage.metadata.identity.targetPlatform}` :
            `output/${this.extensionPackage.identifier}-${this.extensionPackage.version}`

        return extensionPath;
    }

    public get Description(): string {
        return this.extensionPackage.metadata.description;
    }

    extensionPackage: IPackage
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
    public static toPackage(json: string): IPackage {
        return JSON.parse(json);
    }

    public static packageToJson(value: IPackage): string {
        return JSON.stringify(value);
    }
}
