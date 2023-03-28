import { IPackage, PackageWrapper } from "./package";

export class PackageDetails {
    identifier: string;
    version: string;
    packages: IPackage[];

    constructor(identifier: string, version: string, payloads: IPackage[]) {
        this.identifier = identifier;
        this.version = version;
        this.packages = payloads;
    }

    public get mainPayload(): PackageWrapper {
        return new PackageWrapper(this.packages[0]);
    }

    public get payloads(): PackageWrapper[] {
        return this.packages.map(p => new PackageWrapper(p));
    }

    public getPayload(version: string): PackageWrapper | undefined {
        let payload = this.packages.find(
            p => p.version === version
        );

        return (payload === undefined) ? undefined : new PackageWrapper(payload);
    }

    public get versions(): string[] {
        return this.packages.map(p => p.version);
    }

    public get uniqueVersions(): string[] {
        let versions = this.packages.map(p => p.version);
        return versions.filter((v, i, a) => a.indexOf(v) === i);
    }

    public get targets(): string[] {
        return this.payloads.filter(p => p.extensionPackage.metadata.identity.targetPlatform !== null)
            .map(p => p.extensionPackage.metadata.identity.targetPlatform);
    }

    public payload(version: string, platform: string): PackageWrapper | undefined {
        let payloads = this.payloads.find(
            p => p.extensionPackage.version === version
        );
        return payloads;
    }
}