import { PRICES, SITE } from '../site';

export const SITE_ORIGIN = 'https://www.sculptcues.com';
export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const APP_ID = `${SITE_ORIGIN}/#app`;

/** Canonical www URL. Directory pages keep a trailing slash. */
export function pageUrl(pathname: string) {
  if (!pathname || pathname === '/') return `${SITE_ORIGIN}/`;
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${SITE_ORIGIN}${path}`;
}

export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Sculpt Cues',
    url: `${SITE_ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_ORIGIN}/img/icon.webp`,
    },
    email: SITE.email,
    sameAs: [SITE.appStoreUrl, SITE.instagram],
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

/** Home and Featured Flows. No rating data: the App Store listing has none to show. */
export function softwareApplication() {
  return {
    '@type': ['SoftwareApplication', 'MobileApplication'],
    '@id': APP_ID,
    name: SITE.name,
    operatingSystem: 'iOS 17 or later, watchOS 10 or later',
    applicationCategory: 'HealthAndFitness',
    applicationSubCategory: 'Lifestyle',
    description: SITE.description,
    url: `${SITE_ORIGIN}/`,
    installUrl: SITE.appStoreUrl,
    featureList: [
      'Plan a class as a Flow, segment by segment',
      '280+ sculpt, barre and Pilates movements, plus your own',
      'Intensity chart across seven body parts',
      'Cue Coach live beat detection',
      'Apple Watch',
      'Share a Flow with another teacher',
    ],
    publisher: { '@id': ORG_ID },
    offers: PRICES.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      description: plan.note,
      url: SITE.appStoreUrl,
    })),
  };
}

export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function article(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified: Date;
  image: string;
  keywords?: string[];
}) {
  return {
    '@type': ['Article', 'BlogPosting'],
    '@id': `${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    url: opts.url,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Sculpt Cues',
      url: `${SITE_ORIGIN}/`,
    },
    publisher: { '@id': ORG_ID },
    image: {
      '@type': 'ImageObject',
      url: new URL(opts.image, SITE_ORIGIN).href,
    },
    ...(opts.keywords && opts.keywords.length ? { keywords: opts.keywords.join(', ') } : {}),
  };
}

export function graph(extra: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organization(), website(), ...extra],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
