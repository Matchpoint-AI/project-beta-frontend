interface Stats {
  total_content?: number;
  generating?: number;
  ready_for_review?: number;
  approved?: number;
  published?: number;
  exported?: number;
}
declare const NewCardStats: ({
  id: _id,
  stats,
}: {
  id: string;
  stats: Stats;
}) => import('react/jsx-runtime').JSX.Element;
export default NewCardStats;
