interface ErrorState {
    error: boolean;
    message?: string;
}
interface ScrapeWebsiteBtnProps {
    handleSubmit: () => void;
    nameError: ErrorState;
    websiteError: ErrorState;
    progressDescription: string;
    scrapingError: boolean;
}
export declare function ScrapeWebsiteBtn({ handleSubmit, nameError, websiteError, progressDescription, scrapingError, }: ScrapeWebsiteBtnProps): import("react/jsx-runtime").JSX.Element;
export {};
