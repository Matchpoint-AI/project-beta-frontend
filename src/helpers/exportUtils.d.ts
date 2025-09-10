export declare const fetchAndCreatePDF: (
  id: string,
  endpointUrl: string,
  token: string
) => Promise<Blob | undefined>;
export declare const createImageThumbnailsPDF: (
  weeksData: any,
  currentValues: any
) => Promise<Blob>;
export declare const createWordDocument: (weeksData: any, currentValues: any) => Promise<Blob>;
export declare const organizeAndSavePosts: (
  weeksData: any,
  bigFolder: any,
  currentValues: any
) => Promise<void>;
