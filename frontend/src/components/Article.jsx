import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { api } from "../utils/api.js";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [me, setMe] = useState(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [meRes, articleRes, commentsRes] = await Promise.allSettled([
          api.get("/auth/me"),
          api.get(`/api/article/${slug}`),
          api.get(`/api/comments/${slug}`),
        ]);

        if (!mounted) return;

        if (meRes.status === "fulfilled") setMe(meRes.value.data);
        if (articleRes.status === "fulfilled")
          setArticle(articleRes.value.data);
        if (commentsRes.status === "fulfilled")
          setComments(commentsRes.value.data.items);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const onPostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const { data } = await api.post("/api/comment", {
        slug,
        content: comment,
      });
      setComments((prev) => [data, ...prev]);
      setComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const onToggleLike = async () => {
    try {
      const { data } = await api.post(`/api/article/${slug}/like`);
      setLiked(data.liked);
      setArticle((prev) => ({ ...prev, likesCount: data.likesCount }));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  if (!article) return <div className="text-center py-10">Loading...</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 space-y-10">
      <Seo
        title={article.meta?.title || article.title}
        description={article.meta?.description}
        ogTitle={article.meta?.ogTitle}
        ogDescription={article.meta?.ogDescription}
        ogImage={article.meta?.ogImage}
      />

      {/* Header */}
      <header className="space-y-4 border-b border-gray-300 pb-6">
        <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {new Date(article.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button
            onClick={onToggleLike}
            disabled={!me}
            title={!me ? "Login to like" : "Toggle like"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              liked
                ? "bg-pink-100 text-pink-600 border border-pink-300"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <svg
              className={`w-4 h-4 ${liked ? "fill-pink-500" : "fill-gray-400"}`}
              viewBox="0 0 20 20"
            >
              <path
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 
              115.656 5.656L10 18.343l-6.828-6.829a4 4 
              0 010-5.656z"
              />
            </svg>
            {article.likesCount || 0}
          </button>
        </div>
      </header>

      {/* Article content */}
      <section
        className="prose max-w-none prose-lg text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Comments */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Comments</h2>

        {me ? (
          <form
            onSubmit={onPostComment}
            className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 bg-gray-50"
          >
            <img
              src={
                me.avatar || "/placeholder.svg?height=32&width=32&query=avatar"
              }
              alt={me.name || "User"}
              className="w-8 h-8 rounded-full"
            />
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
              Post
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">Login to comment.</p>
        )}

        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c._id}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start gap-3">
                <img
                  src={
                    c.user?.avatar ||
                    "/placeholder.svg?height=32&width=32&query=avatar"
                  }
                  alt={c.user?.name || c.user?.email}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {c.user?.name || c.user?.email}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first!
          </p>
        )}
      </section>
    </article>
  );
}
