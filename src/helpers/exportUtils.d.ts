import JSZip from 'jszip';
export declare const fetchAndCreatePDF: (id: string, endpointUrl: string, token: string) => Promise<Blob | undefined>;
export declare const createImageThumbnailsPDF: (weeksData: Array<Array<{
    dayIndex: number;
    posts: Array<{
        approved: boolean;
        postIndex: number;
        image_url: string[];
        text: string;
    }>;
}>>, currentValues: string[]) => Promise<Blob>;
export declare const createWordDocument: (weeksData: Array<Array<{
    dayIndex: number;
    posts: Array<{
        postIndex: number;
        text: string;
    }>;
}>>, currentValues: string[]) => Promise<Blob>;
export declare const organizeAndSavePosts: (weeksData: Array<Array<{
    dayIndex: number;
    posts: Array<{
        postIndex: number;
        image_url: string[];
    }>;
}>>, bigFolder: JSZip, currentValues: string[]) => Promise<void>;
