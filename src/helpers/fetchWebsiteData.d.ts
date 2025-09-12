export declare const fetchWebsiteData: (url: string, setProgressDescription: (description: string) => void) => Promise<{
    data: any;
    locations: string[];
}>;
