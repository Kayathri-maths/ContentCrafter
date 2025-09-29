const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function fetchTrendingTopics(limit = 5) {
  // NOTE: Production apps should use proper sources/APIs. This is a simple, non-breaking stub.
  // Here we return some sample tech trends; replace with real scraping (Twitter/X, Google Trends) if desired.
  return [
    "AI content generation",
    "Web performance optimization",
    "React Server Components",
    "Edge computing for APIs",
    "JavaScript memory management",
  ].slice(0, limit);
}

async function scrapeResources(topic) {
  // Minimal Google News scrape for images (best-effort, may change)
  const q = encodeURIComponent(topic);
  const url = `https://news.google.com/search?q=${q}`;
  const res = await fetch(url);
  if (!res.ok) return { images: [], videos: [], tweets: [] };
  const html = await res.text();
  const $ = cheerio.load(html);
  const images = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src");
    if (src && images.length < 5) images.push(src);
  });
  // Placeholder for videos and tweets
  const videos = [];
  const tweets = [];
  return { images, videos, tweets };
}

module.exports = { fetchTrendingTopics, scrapeResources };
