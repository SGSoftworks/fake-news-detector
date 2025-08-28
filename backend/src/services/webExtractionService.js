const axios = require("axios");
const cheerio = require("cheerio");

class WebExtractionService {
  constructor() {
    this.userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    ];
  }

  async extractContentFromUrl(url) {
    try {
      console.log(`🔗 Extrayendo contenido de: ${url}`);

      const userAgent =
        this.userAgents[Math.floor(Math.random() * this.userAgents.length)];

      const response = await axios.get(url, {
        headers: {
          "User-Agent": userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
      });

      const $ = cheerio.load(response.data);

      // Remover scripts, styles y elementos no deseados
      $(
        "script, style, nav, header, footer, aside, .advertisement, .ads, .social-share"
      ).remove();

      // Extraer título
      const title = this.extractTitle($);

      // Extraer contenido principal
      const content = this.extractMainContent($);

      // Extraer metadatos
      const metadata = this.extractMetadata($);

      // Extraer fecha de publicación
      const publishDate = this.extractPublishDate($);

      // Extraer autor
      const author = this.extractAuthor($);

      // Extraer fuente/origen
      const source = this.extractSource(url);

      const extractedData = {
        url,
        title,
        content,
        metadata,
        publishDate,
        author,
        source,
        extractedAt: new Date().toISOString(),
        contentLength: content.length,
        hasContent: content.length > 100,
      };

      console.log(`✅ Contenido extraído: ${content.length} caracteres`);
      return extractedData;
    } catch (error) {
      console.error(`❌ Error extrayendo contenido de ${url}:`, error.message);
      throw new Error(
        `No se pudo extraer contenido de la URL: ${error.message}`
      );
    }
  }

  extractTitle($) {
    // Priorizar meta tags, luego h1, luego title
    let title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim();

    return title || "Título no disponible";
  }

  extractMainContent($) {
    // Selectores comunes para contenido principal
    const contentSelectors = [
      "article",
      ".article-content",
      ".post-content",
      ".entry-content",
      ".content",
      ".main-content",
      '[role="main"]',
      ".story-body",
      ".news-content",
      ".article-body",
    ];

    let content = "";

    // Buscar por selectores específicos
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 200) break;
      }
    }

    // Si no se encuentra contenido específico, usar párrafos
    if (!content || content.length < 200) {
      const paragraphs = $("p")
        .map((i, el) => $(el).text().trim())
        .get();
      content = paragraphs.join(" ").trim();
    }

    // Limpiar contenido
    content = this.cleanContent(content);

    return content;
  }

  extractMetadata($) {
    const metadata = {};

    // Descripción
    metadata.description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    // Keywords
    metadata.keywords = $('meta[name="keywords"]').attr("content") || "";

    // Imagen
    metadata.image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // Tipo de contenido
    metadata.type = $('meta[property="og:type"]').attr("content") || "";

    return metadata;
  }

  extractPublishDate($) {
    // Buscar fechas en meta tags
    let date =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="publish_date"]').attr("content") ||
      $('meta[name="date"]').attr("content") ||
      $("time[datetime]").attr("datetime") ||
      $(".publish-date").text().trim() ||
      $(".date").text().trim();

    return date || null;
  }

  extractAuthor($) {
    // Buscar autor en meta tags y elementos
    let author =
      $('meta[name="author"]').attr("content") ||
      $('meta[property="article:author"]').attr("content") ||
      $(".author").text().trim() ||
      $(".byline").text().trim() ||
      $('[rel="author"]').text().trim();

    return author || null;
  }

  extractSource(url) {
    try {
      const urlObj = new URL(url);
      return {
        domain: urlObj.hostname,
        protocol: urlObj.protocol,
        path: urlObj.pathname,
      };
    } catch {
      return { domain: "unknown", protocol: "unknown", path: "/" };
    }
  }

  cleanContent(content) {
    if (!content) return "";

    return content
      .replace(/\s+/g, " ") // Múltiples espacios a uno
      .replace(/\n+/g, " ") // Saltos de línea a espacios
      .replace(/\t+/g, " ") // Tabs a espacios
      .trim();
  }

  async validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new WebExtractionService();
