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
    api
      .get("/auth/me")
      .then((r) => mounted && setMe(r.data))
      .catch(() => {});
    api.get(`/api/article/${slug}`).then((r) => {
      if (!mounted) return;
      setArticle(r.data);
    });
    api.get(`/api/comments/${slug}`).then((r) => {
      if (!mounted) return;
      setComments(r.data.items);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const onPostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const { data } = await api.post("/api/comment", { slug, content: comment });
    setComments((prev) => [data, ...prev]);
    setComment("");
  };

  const onToggleLike = async () => {
    try {
      const { data } = await api.post(`/api/article/${slug}/like`);
      setLiked(data.liked);
      setArticle((prev) => ({ ...prev, likesCount: data.likesCount }));
    } catch {}
  };

  if (!article) return <div>Loading...</div>;

  return (
    <article className="space-y-6">
      <Seo
        title={article.meta?.title || article.title}
        description={article.meta?.description}
        ogTitle={article.meta?.ogTitle}
        ogDescription={article.meta?.ogDescription}
        ogImage={article.meta?.ogImage}
      />
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <div className="text-sm text-gray-500">
          {new Date(article.createdAt).toLocaleString()} •{" "}
          {article.likesCount || 0} likes
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLike}
            className="bg-blue-600 text-white rounded px-3 py-2 text-sm"
            disabled={!me}
            title={!me ? "Login to like" : "Toggle like"}
          >
            {liked ? "Unlike" : "Like"}
          </button>
        </div>
      </header>

      <section
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Comments</h2>
        {me ? (
          <form onSubmit={onPostComment} className="flex items-center gap-2">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="bg-blue-600 text-white rounded px-3 py-2 text-sm">
              Post
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">Login to comment.</p>
        )}

        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c._id} className="border rounded p-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    c.user?.avatar ||
                    "/placeholder.svg?height=24&width=24&query=avatar"
                  }
                  alt={c.user?.name || c.user?.email}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-sm">
                  <div className="font-medium">
                    {c.user?.name || c.user?.email}
                  </div>
                  <div className="text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm">{c.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
