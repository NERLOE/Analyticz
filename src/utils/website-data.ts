import { z } from "zod";
import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";

const iconSelectors = [
  { selector: "link[rel='icon' i]", attr: "href" },
  { selector: "link[rel='shortcut icon' i]", attr: "href" },
  { selector: "link[rel='apple-touch-icon' i]", attr: "href" },
  { selector: "link[rel='apple-touch-icon-precomposed' i]", attr: "href" },
  { selector: "link[rel='apple-touch-startup-image' i]", attr: "href" },
  { selector: "link[rel='mask-icon' i]", attr: "href" },
  { selector: "link[rel='fluid-icon' i]", attr: "href" },
  { selector: "meta[name='msapplication-TileImage' i]", attr: "content" },
  { selector: "meta[name='twitter:image' i]", attr: "content" },
  { selector: "meta[property='og:image' i]", attr: "content" },
  { selector: "meta[itemprop='image' i]", attr: "content" },
];

function getIconsFromHtml($: CheerioAPI) {
  const icons: string[] = [];

  iconSelectors.forEach((sel, index) => {
    const src = $(sel.selector).attr(sel.attr);
    if (src) icons.push(src);
  });

  return icons.sort((a, b) =>
    a.endsWith(".svg") > b.endsWith(".svg") ? -1 : 1
  );
}

function getTitleFromHtml($: CheerioAPI) {
  const title = $("head title").first().text();

  return title;
}

export async function getWebsiteData(url: string): Promise<{
  title: string;
  icon: string | null;
} | null> {
  const isUrl = z.string().url();
  if (!isUrl.safeParse(url).success) {
    console.error(`Tried parsing ${url} as URL, but failed`);
    return null;
  }

  try {
    const html = (await axios.get(url)).data;
    //console.log(`website-data html`, html);
    const $ = cheerio.load(html);
    const icons = getIconsFromHtml($);
    const title = getTitleFromHtml($);

    let icon = icons[0] ?? null;
    if (icon && !isUrl.safeParse(icon).success) {
      icon = `${new URL(url).origin}${icon}`;
    }

    console.log("icon", icon);
    console.log("title", title);

    if (!icon) {
      console.log(`Couldn't find any icon for url, ${url}`, icons);
    }

    return { icon: icon, title: title };
  } catch (err) {
    return null;
  }
}

export function shouldBeUpdated(lastUpdate: Date) {
  return Date.now() - lastUpdate.getTime() > 1000 * 60 * 10;
}
