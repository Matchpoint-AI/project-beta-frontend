import { getServiceURL } from "./getServiceURL";

export default async function fetchPrompts(token: string) {
   const url = `${getServiceURL("content-gen")}/api/v1/app_prompts`;
   const response = await fetch(url, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   console.log("data", response);
   if (!response.ok) return null;
   const data = await response.json();

   data.content_generation = data.content_generation.sort(
      (a: any, b: any) => a.version - b.version
   );
   data.scrape_website = data.scrape_website.sort(
      (a: any, b: any) => a.version - b.version
   );
   return data;
}
