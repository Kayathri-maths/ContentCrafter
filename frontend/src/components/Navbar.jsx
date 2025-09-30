import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils/api.js";

export default function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [me, setMe] = useState(null);
  const [q, setQ] = useState(params.get("q") || "");
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me", { withCredentials: true });
        if (mounted) {
          setMe(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-semibold text-lg text-blue-600">
          TrendWise
        </Link>

        <form onSubmit={onSearch} className="ml-auto flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="border rounded px-3 py-2 text-sm w-56"
          />
          <button className="bg-blue-600 text-white rounded px-3 py-2 text-sm">
            Search
          </button>
        </form>

        {me ? (
          <div className="flex items-center gap-3">
            <img
              src={
                me.avatar || "/placeholder.svg?height=24&width=24&query=avatar"
              }
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <span className="text-sm">{me.name || me.email}</span>
            {me.roles?.includes("admin") && (
              <Link to="/admin" className="text-sm text-blue-600 underline">
                Admin
              </Link>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-sm text-blue-600 underline">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
