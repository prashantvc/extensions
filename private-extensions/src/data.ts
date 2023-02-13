// To parse this data:
//
//   import { Convert, Extension } from "./file";
//
//   const extension = Convert.toExtension(json);

export interface Data {
    name: string;
    displayName: string;
    description: string;
    icon: string;
    version: string;
    preview: boolean;
    publisher: string;
    author: null;
    galleryBanner: null;
    qna: string;
    license: null;
    homepage: string;
    repository: null;
    categories: string[];
    keywords: string[];
    identifier: string;
    isPreRelease: boolean;
}


// Converts JSON strings to/from your types
export class Convert {
    public static toExtension(json: string): Data {
        return JSON.parse(json);
    }

    public static extensionToJson(value: Data): string {
        return JSON.stringify(value);
    }
}
