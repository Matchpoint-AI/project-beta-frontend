export declare const capitalizeFirstLetterOfEachWord: (str: string) => string;
interface Post {
  id: string;
  text: string;
  image_url: string[];
  image_prompt: string;
  platform: string;
  image_index?: number;
  approved: boolean;
  posted: boolean;
  postIndex: number;
}
interface Day {
  durationNum: number;
  start_date: string;
  approved: boolean;
  dayIndex: number;
  posts: Post[];
}
type Week = Day[];
export declare const structureData: (data: Record<string, Record<string, unknown>>) => Week[];
export {};
