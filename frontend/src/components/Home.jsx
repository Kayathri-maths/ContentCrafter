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
    <section className="max-w-7xl mx-auto space-y-8">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Trending Articles</h1>
        <p className="text-gray-600 mt-2 text-sm">
          Discover the latest articles people are reading right now
        </p>
      </div>

      {/* Articles grid */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((a) => (
          <li
            key={a.slug}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <Link to={`/article/${a.slug}`} className="flex flex-col h-full">
              {/* Article Image */}
              <div className="w-full h-40 bg-gray-100">
                <img
                  src={
                    a?.meta?.ogImage ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={a.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {a.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {a.meta?.description || "No description available."}
                  </p>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t">
                  <span>
                    {new Date(a.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-pink-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    {a.likesCount || 0}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}

        {/* Empty state */}
        {data.items.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            No articles found. Try a different search.
          </div>
        )}
      </ul>
    </section>
  );
}
