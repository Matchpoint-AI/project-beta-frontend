export const capitalizeFirstLetterOfEachWord = (str: string) => {
  if (str === undefined) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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

export const structureData = (data: Record<string, Record<string, any>>): Week[] => {
  // Transform the object into an array of weeks
  return Object.keys(data)
    .sort()
    .map((weekKey) => {
      const weekData = data[weekKey];

      // Transform the week object into an ordered array of days
      return Object.keys(weekData)
        .sort((a, b) => {
          // Sorting days in numerical order (day_1, day_2, ...)
          return parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]);
        })
        .map((dayKey, dayIndex) => {
          const dayData = weekData[dayKey];
          const approved = dayData.approved || false;
          // Transform the posts within each day into an ordered array
          const posts = Object.keys(dayData)
            .filter((postKey) => postKey.startsWith('post_'))
            .sort((a, b) => {
              // Sorting posts in numerical order (post_1, post_2, ...)
              return parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]);
            })
            .map((postKey, postIndex) => ({
              ...dayData[postKey],
              postIndex: postIndex + 1, // Add post index (1-based)
              approved: dayData[postKey].approved || false,
              posted: dayData[postKey].posted || false,
            }));
          return {
            durationNum: dayData.durationNum || 0,
            start_date: dayData.start_date || '',
            approved,
            posts,
            dayIndex: dayIndex + 1, // Add day index (1-based)
          };
        });
    });
};
