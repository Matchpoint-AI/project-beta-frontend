import { NavigateAction } from 'react-big-calendar';
interface CampaignToolBarProps {
    label: string;
    date: Date;
    onNavigate: (navigate: NavigateAction, date?: Date) => void;
}
declare const CampaignToolBar: (props: CampaignToolBarProps) => any;
export default CampaignToolBar;
