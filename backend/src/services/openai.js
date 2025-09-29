const OpenAI = require("openai");

const client = new OpenAI({
  base_url: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});
async function generateArticleForTopic(topic, resources = {}) {
  const { images = [], videos = [], tweets = [] } = resources;
  const prompt = `
You are an expert SEO content writer. Write a comprehensive blog article for the topic: "${topic}".

Requirements:
- Length: 900-1400 words.
- Use clear HTML structure with headings (H1, H2, H3), paragraphs, lists where helpful.
- Include an H1 for the title.
- Include embedded media placeholders where appropriate:
  - Images: Use <img src="..."> with provided URLs if relevant.
  - Videos: Use <iframe src="..."> for YouTube/Vimeo URLs if provided.
  - Tweets: Use <blockquote class="twitter-tweet"><a href="..."></a></blockquote>.
- Include internal subheadings that improve readability and SEO.
- Include a conclusion.
- Do not include <html>, <head>, or <body> tags. Only the article content.

Also provide a JSON meta block at the end surrounded by META_START ... META_END:
{
  "title": "SEO Title (<=60 chars)",
  "description": "Meta description (<=160 chars)",
  "ogTitle": "OG Title",
  "ogDescription": "OG Description",
  "keywords": ["keyword1","keyword2","keyword3"]
}
  `.trim();

  // Build a media hint
  const mediaHint =
    [
      images.length ? `Images:\n${images.map((u) => `- ${u}`).join("\n")}` : "",
      videos.length ? `Videos:\n${videos.map((u) => `- ${u}`).join("\n")}` : "",
      tweets.length ? `Tweets:\n${tweets.map((u) => `- ${u}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n") || "No external media found";

  const { choices } = await client.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You generate SEO-friendly, human-readable, well-structured HTML blog posts with proper headings and meta guidance.",
      },
      {
        role: "user",
        content: `${prompt}\n\nContext media:\n${mediaHint}`,
      },
    ],
  });

  const raw = choices?.[0]?.message?.content || "";
  // Parse meta from META_START ... META_END
  const metaMatch = raw.match(/META_START([\s\S]*?)META_END/);
  let meta = {};
  if (metaMatch) {
    try {
      meta = JSON.parse(metaMatch[1]);
    } catch {}
  }
  const content = raw.replace(/META_START[\s\S]*?META_END/, "").trim();

  // Derive an OG image (first image if exists)
  const ogImage = meta.ogImage || resources.images?.[0] || "";

  return {
    title: meta.title || topic,
    meta: {
      title: meta.title || topic,
      description: meta.description || "",
      ogTitle: meta.ogTitle || meta.title || topic,
      ogDescription: meta.ogDescription || meta.description || "",
      ogImage,
      keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
    },
    content,
    media: {
      images,
      videos,
      tweets,
    },
  };
}

module.exports = { generateArticleForTopic };
