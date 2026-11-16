import assert from 'node:assert/strict';
import { appStoreCampaignUrl } from '../src/lib/appStoreUrl.js';

const hero = appStoreCampaignUrl('site-home-hero');
assert.equal(hero, 'https://apps.apple.com/app/apple-store/id6831637468?pt=128746925&ct=site-home-hero&mt=8');

assert.equal(
  appStoreCampaignUrl('Site Home Hero!'),
  'https://apps.apple.com/app/apple-store/id6831637468?pt=128746925&ct=sitehomehero&mt=8',
);

const long = appStoreCampaignUrl('site-blog-matching-sculpt-movements-to-bpm');
const ct = new URL(long).searchParams.get('ct');
assert.equal(ct.length, 40);
assert.equal(ct, 'site-blog-matching-sculpt-movements-to-b');

assert.equal(new URL(appStoreCampaignUrl('')).searchParams.get('ct'), 'site');
