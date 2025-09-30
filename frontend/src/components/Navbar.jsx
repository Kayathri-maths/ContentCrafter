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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        {/* Brand */}
        <Link
          to="/"
          className="font-bold text-xl tracking-tight text-blue-600 hover:text-blue-700 transition-colors"
        >
          TrendWise
        </Link>

        {/* Search */}
        <form
          onSubmit={onSearch}
          className="ml-auto flex items-center w-full max-w-xs"
        >
          <div className="relative w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles..."
              className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* User Section */}
        {me ? (
          <div className="flex items-center gap-3">
            <img
              src={
                me.avatar || "/placeholder.svg?height=32&width=32&query=avatar"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
              {me.name || me.email}
            </span>
            {me.roles?.includes("admin") && (
              <Link
                to="/admin"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Admin
              </Link>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
