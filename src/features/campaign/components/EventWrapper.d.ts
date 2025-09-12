type EventPost = {
    approved: boolean;
    timing: string;
    [key: string]: unknown;
};
type EventType = {
    title: string;
    status: string;
    posts: EventPost[];
    [key: string]: unknown;
};
declare const EventWrapper: (props: {
    event: EventType;
}) => import("react/jsx-runtime").JSX.Element;
export default EventWrapper;
