import { createFileRoute } from "@tanstack/react-router";
import { LessonWorkspace } from "@/components/lesson-workspace";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Scriptroom — Learn JavaScript & React" },
    { name: "description", content: "Learn JavaScript and React with simple interactive lessons, editable code, live previews, and a console." },
    { property: "og:title", content: "Scriptroom — Learn JavaScript & React" },
    { property: "og:description", content: "Practice JavaScript and React one lesson at a time in your interactive classroom." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LessonWorkspace,
});
