import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../utils/api.js";

export default function Home() {
  const [params] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0 });
  const q = params.get("q") || "";

  useEffect(() => {
    let mounted = true;

    const fetchArticles = async () => {
      try {
        const response = await api.get("/api/articles", { params: { q } });
        if (mounted) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();

    return () => {
      mounted = false;
    };
  }, [q]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Trending Articles</h1>
      <ul className="grid gap-6 md:grid-cols-2">
        {data.items.map((a) => (
          <li key={a.slug} className="border rounded-lg p-4 hover:shadow-sm">
            <Link to={`/article/${a.slug}`} className="space-y-2 block">
              <h2 className="text-lg font-semibold">{a.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {a.meta?.description}
              </p>
              <div className="text-xs text-gray-500">
                {new Date(a.createdAt).toLocaleString()} • {a.likesCount || 0}{" "}
                likes
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
