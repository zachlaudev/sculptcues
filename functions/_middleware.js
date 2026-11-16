// Sends the apex host to www. This runs only when the request reaches the
// Cloudflare Pages project (the apex is a custom domain on the project).
// Preview hosts (*.pages.dev) are left alone.
// If the apex is not attached to this project, add the Redirect Rule in README.md.

const APEX = 'sculptcues.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === APEX) {
    url.hostname = 'www.sculptcues.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
