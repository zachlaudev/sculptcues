import { getCollection } from 'astro:content';

/** Published posts, newest first. Drafts and future-dated posts are hidden until their pubDate. */
export async function getPosts() {
  const now = new Date();
  return (await getCollection('blog', ({ data }) => !data.draft && data.pubDate <= now))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
