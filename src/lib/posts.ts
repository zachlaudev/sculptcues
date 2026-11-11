import { getCollection } from 'astro:content';

/** Published posts, newest first. Drafts are hidden; everything else is live as soon as it is merged. */
export async function getPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
