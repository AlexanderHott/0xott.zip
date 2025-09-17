import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async (context) => {
  const site = context.site;
  if (!site) {
    throw new Error("Missing `site` in astro config.");
  }
  const [blogPosts, projects] = await Promise.all([
    getCollection("blog"),
    getCollection("project"),
  ]);

  // console.log("canonicalURL", blogPosts[0].data, blogPosts[0]);

  const items = blogPosts
    .filter((post) => post.data.draft === false)
    .map((post) => {
      // const { Content } = await render(post);
      return {
        /** Link to item */
        link: `/blog/${post.id}`,
        /** Full content of the item. Should be valid HTML */
        content: post.body,
        /** Title of item */
        title: post.data.title,
        /** Publication date of item */
        pubDate: post.data.createdAt,
        /** Item description */
        description: post.data.description,
        /** Append some other XML-valid data to this item */
        customData: undefined,
        /** Categories or tags related to the item */
        categories: post.data.tags,
        /** The item author's email address */
        author: "Alex Ott",
        /** A URL of a page for comments related to the item */
        commentsUrl: undefined,
        /** The RSS channel that the item came from */
        source: undefined,
        /** A media object that belongs to the item */
        enclosure: undefined,
      };
    }) satisfies RSSFeedItem[];

  return rss({
    // `<title>` field in output xml
    title: "0xott's blog & projects",
    // `<description>` field in output xml
    description: "A humble Astronaut’s guide to the stars",
    site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items,
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
};
