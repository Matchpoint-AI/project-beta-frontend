import { NavigateAction } from 'react-big-calendar';
interface CampaignToolBarProps {
    label: string;
    date: Date;
    onNavigate: (navigate: NavigateAction, date?: Date) => void;
}
declare const CampaignToolBar: (props: CampaignToolBarProps) => import("react/jsx-runtime").JSX.Element;
export default CampaignToolBar;
