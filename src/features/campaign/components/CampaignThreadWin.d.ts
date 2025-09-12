import { Messages } from '../../users/pages/UserDataPage';
interface CampaignThreadWinProps {
    open: boolean;
    onClose: () => void;
    messages: Messages | null;
    addMessage: (prompt: string) => void;
    popMessage: () => void;
}
export default function CampaignThreadWin({ open, onClose, messages, addMessage, popMessage, }: CampaignThreadWinProps): import("react/jsx-runtime").JSX.Element | undefined;
export {};
