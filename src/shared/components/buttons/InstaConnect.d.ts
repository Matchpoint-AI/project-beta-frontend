import React from 'react';
interface Stats {
  approved: number;
  ready_for_review?: number;
  total_content?: number;
  published?: number;
}
interface InstaConnectProps {
  publish?: boolean;
  stats: Stats;
  startDate: string;
  duration: number;
}
declare const InstaConnect: React.FC<InstaConnectProps>;
export default InstaConnect;
