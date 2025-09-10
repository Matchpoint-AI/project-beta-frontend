interface Post {
  id: string;
  image_prompt: string;
  text: string;
  image_url: string[];
  posted: boolean;
  approved: boolean;
}
interface PostPreviewProps {
  index: number;
  day: number;
  week: number;
  content: Post;
  brandName: string;
  imageIndex: number[];
  campaign_content_id: string;
  updataImage: (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    newImage: string | null,
    nexText: string
  ) => void;
}
declare const PostPreview: ({
  week,
  day,
  index,
  content,
  brandName,
  imageIndex,
  campaign_content_id,
  updataImage,
}: PostPreviewProps) => import('react/jsx-runtime').JSX.Element;
export default PostPreview;
