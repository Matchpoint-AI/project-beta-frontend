interface CampaignToolBarProps {
  label: string;
  date: Date;
  onNavigate: (action: number, date: Date) => void;
}
declare const CampaignToolBar: (
  props: CampaignToolBarProps
) => import('react/jsx-runtime').JSX.Element;
export default CampaignToolBar;
