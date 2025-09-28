import { useEffect } from "react";

export default function Seo({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
}) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setProp = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description || "");
    setProp("og:title", ogTitle || title || "");
    setProp("og:description", ogDescription || description || "");
    if (ogImage) setProp("og:image", ogImage);
  }, [title, description, ogTitle, ogDescription, ogImage]);

  return null;
}
