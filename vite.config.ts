import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export function webflowExtension(manifest) {
  const templatePromise = fetch(
    `https://webflow-ext.com/template?name=${manifest.name}`
  )
    .then((res) => res.text())
    .catch(() => console.log("Failed retrieving template"));

  const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;

  return {
    name: "webflow-extension",

    /**
     * Intercept manifest requests.
     */
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/__webflow") {
          const manifestJSON = JSON.stringify(manifest);

          res.writeHead(200, {
            "Content-Length": Buffer.byteLength(manifestJSON),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          });

          return res.end(manifestJSON);
        }

        next();
      });
    },

    /**
     * Transform entry index.html.
     */
    async transformIndexHtml(html, { path }) {
      if (path !== "/index.html") return html;

      const template = await templatePromise;
      if (!template) return html;

      const headMatch = html.match(headRegex)?.[1] || "";
      const bodyMatch = html.match(bodyRegex)?.[1] || "";

      const extensionHtml = template.replace("{{ui}}", headMatch + bodyMatch);
      return extensionHtml;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webflowExtension({ name: "Formly", size: "comfortable" }),
  ],
  server: { port: 1337 },
});
