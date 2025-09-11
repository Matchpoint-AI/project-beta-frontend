import { Post } from '../../../pages/UserDataPage';
interface CampaignContentWinProps {
  open: boolean;
  onClose: () => void;
  content: Post[][][];
}
export default function CampaignContentWin({
  open,
  onClose,
  content,
}: CampaignContentWinProps): import('react/jsx-runtime').JSX.Element;
export {};
