import { z } from "zod";
import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";

const iconSelectors = [
  "link[rel='icon' i][href]",
  "link[rel='shortcut icon' i][href]",
  "link[rel='apple-touch-icon' i][href]",
  "link[rel='apple-touch-icon-precomposed' i][href]",
  "link[rel='apple-touch-startup-image' i][href]",
  "link[rel='mask-icon' i][href]",
  "link[rel='fluid-icon' i][href]",
  "meta[name='msapplication-TileImage' i][content]",
  "meta[name='twitter:image' i][content]",
  "meta[property='og:image' i][content]",
];

function getIconsFromHtml($: CheerioAPI) {
  const icons: string[] = [];

  $(iconSelectors.join()).each((i, el) => {
    const src = $(el).attr("href");
    if (src) icons.push(src);
  });

  return icons;
}

function getTitleFromHtml($: CheerioAPI) {
  const title = $("title").text();

  return title;
}

export async function getWebsiteData(url: string): Promise<{
  title: string;
  icon?: string;
} | null> {
  const isUrl = z.string().url();
  if (!isUrl.safeParse(url).success) {
    console.error(`Tried parsing ${url} as URL, but failed`);
    return null;
  }

  try {
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);
    const icons = getIconsFromHtml($);
    const title = getTitleFromHtml($);

    let icon = icons[0];
    if (icon && !isUrl.safeParse(icon).success) {
      icon = `${new URL(url).origin}${icon}`;
    }

    return { icon: icon, title: title };
  } catch (err) {
    return null;
  }
}
