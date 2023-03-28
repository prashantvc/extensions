import { IExtension, ExtensionWrapper } from "./package";

export class ExtensionPackage {
    identifier: string;
    version: string;
    extensions: ExtensionWrapper[];

    constructor(identifier: string, version: string, extensions: IExtension[]) {
        this.identifier = identifier;
        this.version = version;
        this.extensions = extensions.map(p => new ExtensionWrapper(p));
    }

    public get mainExtension(): ExtensionWrapper {
        return this.extensions[0];
    }

    public extention(version: string, target: string | undefined = undefined): ExtensionWrapper | undefined {
        if (target !== undefined) {
            let exts = this.extensions
                .find(p => p.extension.version === version && p.extension.target === target);

            return (exts === undefined) ? undefined : exts;
        }

        let payload = this.extensions.find(
            p => p.extension.version === version
        );
        return (payload === undefined) ? undefined : payload;
    }

    public get versions(): string[] {
        return this.extensions.map(p => p.extension.version);
    }

    public get uniqueVersions(): string[] {
        let versions = this.extensions.map(p => p.extension.version);
        return versions.filter((v, i, a) => a.indexOf(v) === i);
    }

    public get targets(): string[] {
        return this.extensions.filter(p => p.extension.metadata.identity.targetPlatform !== null)
            .map(p => p.extension.metadata.identity.targetPlatform);
    }


}