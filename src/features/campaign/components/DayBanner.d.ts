interface DayBannerProps {
    index: number;
    startDate: string;
    currentPage: number;
    content: {
        approved: boolean;
        posts: Array<{
            text: string;
            image_url: string[];
            approved: boolean;
            posted: boolean;
            [key: string]: unknown;
        }>;
        dayIndex: number;
    };
    generatedContentId: string;
    handleApprovalUpdate: (weekIndex: number, dayIndex: number, postIndex: number | null, isApproved: boolean) => void;
    setOpen: (index: number) => void;
    brandName: string;
    updataImage: (week: number, day: number, post: number, imageIndex: number, newImage: string, text: string) => void;
}
declare const DayBanner: ({ index, startDate, currentPage, content, generatedContentId, handleApprovalUpdate, setOpen, brandName, updataImage, }: DayBannerProps) => any;
export default DayBanner;
