export interface Post {
  id: string;
  text: string;
  image_url: string[];
  image_prompt: string;
  platform: string;
  image_index?: number;
  approved: boolean;
  posted: boolean;
  postIndex: number | null;
}

export interface Day {
  durationNum: number;
  start_date: string;
  posts: Post[];
  approved: boolean;
  dayIndex: number;
  dayKey?: string;
  postIndex: number | null;
}

export type Week = Day[];
