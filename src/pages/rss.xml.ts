import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getPosts());
  return rss({
    title: 'Sculpt Cues Journal',
    description: 'Class ideas, cueing tips and music for sculpt teachers.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
    })),
  });
}
