export async function GET() {
    const baseUrl = "https://yourdomain.com"; // Replace with env var in prod

    // Static routes
    const routes = ["", "/privacy", "/terms", "/contact"];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
            .map((route) => {
                return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "" ? 1.0 : 0.8}</priority>
  </url>`;
            })
            .join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
