import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";

export default function Admin() {
  const [me, setMe] = useState(null);
  const [articles, setArticles] = useState([]);
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [meResponse, articlesResponse] = await Promise.all([
          api.get("/auth/me"),
          api.get("/api/articles"),
        ]);

        if (!mounted) return;

        setMe(meResponse.data);
        if (!meResponse.data?.roles?.includes("admin")) navigate("/");

        setArticles(articlesResponse.data.items);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const onGenerate = async () => {
    try {
      await api.post("/api/generate", { topic });

      const { data } = await api.get("/api/articles");
      setArticles(data.items);

      setTopic("");
    } catch (err) {
      console.error("Failed to generate article or fetch articles:", err);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Generate Article</h2>
        <div className="flex items-center gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional, leave empty to use trending)"
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            onClick={onGenerate}
            className="bg-blue-600 text-white rounded px-3 py-2"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-medium mb-3">Articles</h2>
        <ul className="space-y-2">
          {articles.map((a) => (
            <li key={a.slug} className="flex items-center justify-between">
              <Link
                to={`/article/${a.slug}`}
                className="text-blue-600 underline"
              >
                {a.title}
              </Link>
              <span className="text-xs text-gray-500">
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
