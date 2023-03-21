// To parse this data:
//
//   import { Convert, Extension } from "./file";
//
//   const extension = Convert.toExtension(json);

export interface Extension {
    name:          string;
    displayName:   string;
    description:   string;
    icon:          string;
    version:       string;
    preview:       boolean;
    publisher:     string;
    author:        null;
    galleryBanner: GalleryBanner;
    qna:           string;
    license:       string;
    homepage:      string;
    repository:    Repository;
    bugs:          Bugs;
    engines:       Engines;
    categories:    string[];
    keywords:      string[];
    identifier:    string;
    isPreRelease:  boolean;
}

export interface Bugs {
    url: string;
}

export interface Engines {
    vscode: string;
}

export interface GalleryBanner {
    theme: string;
    color: string;
}

export interface Repository {
    type: string;
    url:  string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toExtension(json: string): Extension {
        return JSON.parse(json);
    }

    public static extensionToJson(value: Extension): string {
        return JSON.stringify(value);
    }
}
