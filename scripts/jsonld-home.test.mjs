import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
assert.ok(blocks.length > 0, 'homepage is missing JSON-LD');

const graphs = blocks.map((raw) => JSON.parse(raw));
const nodes = graphs.flatMap((data) => (Array.isArray(data['@graph']) ? data['@graph'] : [data]));

function typesOf(node) {
  const value = node['@type'];
  return Array.isArray(value) ? value : [value];
}

const app = nodes.find((node) => typesOf(node).includes('SoftwareApplication'));
const faq = nodes.find((node) => typesOf(node).includes('FAQPage'));
assert.ok(app, 'homepage JSON-LD has no SoftwareApplication node');
assert.ok(faq, 'homepage JSON-LD has no FAQPage node');
assert.ok(Array.isArray(app.offers) && app.offers.length > 0, 'SoftwareApplication offers are missing');
assert.ok(Array.isArray(faq.mainEntity) && faq.mainEntity.length > 0, 'FAQPage mainEntity is missing');
for (const question of faq.mainEntity) {
  assert.equal(question['@type'], 'Question');
  assert.equal(typeof question.name, 'string');
  assert.equal(question.acceptedAnswer['@type'], 'Answer');
  assert.equal(typeof question.acceptedAnswer.text, 'string');
}

console.log(`homepage JSON-LD ok (${blocks.length} block, SoftwareApplication + FAQPage)`);
