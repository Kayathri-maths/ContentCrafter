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
    <section className="max-w-5xl mx-auto px-6 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Manage articles and generate new ones
        </p>
      </header>

      {/* Generate Article */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Generate Article
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional, leave empty for trending)"
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onGenerate}
            className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700 transition"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Articles</h2>

        {articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">Title</th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Created
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr
                    key={a.slug}
                    className="border-b border-gray-300 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">
                      <Link
                        to={`/article/${a.slug}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to={`/article/${a.slug}`}
                        className="text-sm text-gray-700 hover:text-blue-600 transition"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No articles yet.</p>
        )}
      </div>
    </section>
  );
}
