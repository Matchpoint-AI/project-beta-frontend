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
}) => any;
export default EventWrapper;
