import { API_URL } from "../utils/api.js";

export default function Login() {
  const googleUrl = `${API_URL}/auth/google`;
  return (
    <section className="max-w-md mx-auto text-center space-y-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-gray-600">
        Use Google to sign in and start liking and commenting on articles.
      </p>
      <a
        href={googleUrl}
        className="inline-flex items-center justify-center bg-blue-600 text-white rounded px-4 py-2"
      >
        Continue with Google
      </a>
    </section>
  );
}
