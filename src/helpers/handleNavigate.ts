import { NavigateFunction } from "react-router-dom";
import posthog from "./posthog";

export default function handleNavigate(
  id: string,
  dest: "/dashboard" | "/onboard" | "/landing" | "/campaign" | string,
  navigate: NavigateFunction
) {
  let pageName = "";

  if (dest === "/dashboard") pageName = "Dashboard";
  else if (dest === "/onboard") pageName = "Onboard";
  else if (dest === "/landing") pageName = "Landing Page";
  else if (dest === "/campaign") pageName = "Campaign";
  else if (dest.includes("/campaign/content"))
    pageName = "Campaign Content Page";
  else navigate(dest);

  if (posthog.__loaded) {
    posthog.capture(`Navigated to ${pageName}`, {
      distinct_id: id,
    });
  }
  navigate(dest);
}
