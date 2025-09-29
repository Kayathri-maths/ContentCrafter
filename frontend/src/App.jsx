import { Outlet, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import Article from "./components/Article";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        {/* Outlet added for future nested routes */}
        <Outlet />
      </main>
      <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">
        Content Crafter © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
