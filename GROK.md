# Writing for the Sculpt Cues Journal

This is the brief for every Journal post, whoever (or whatever) drafts it. Posts are published by merging a pull request into `main`; Cloudflare Pages deploys on merge. There is no scheduled auto-publishing.

## Who we are
Sculpt Cues is an iPhone app for sculpt teachers (sculpt = music-driven, low-impact strength classes using bodyweight, light dumbbells, loop bands, balls or a beam). Only describe features listed here:
- 280+ movements sorted by body part (core, arms, legs, glutes, back, chest), plus custom movements.
- Flows: a class made of segments (one segment ≈ one song), with folders, rearranging and suggested next movements.
- Intensity chart: scoring across 7 body parts (core, glutes, legs, arms, shoulders, back, chest) with an overwork caution and counter-movement suggestions.
- Cue Coach: listens to any song playing aloud, detects BPM live and pulses Up/Down cues at Half, Single or Double time (also In–Out, Left–Right). Nothing is recorded; audio stays on the phone.
- Flow sharing by link or file.
- Pricing: $7.99/month, $39.99/year (7-day free trial), $79.99 lifetime.
- Homepage figures (8,000+ instructors, 63,000+ Flows, 1,200+ studios) are verified and may be quoted.
Never invent features (no QR import, Android, web app, video library, etc. unless added above).

## Readers
Working sculpt and mat Pilates teachers, studio owners and instructors in training, mainly in the US, Australia, the UK and Singapore.

## Voice
- Premium team voice: "we" / "The Sculpt Cues Team". Never founder framing ("I built…", "as a solo dev…").
- Warm, confident, practical: a senior teacher talking to a colleague.
- Short paragraphs, plain words, British spelling (customise, colour, programme).
- Specific over generic: name movements, counts, BPM ranges, cue wording.
- No hype, no emojis, no "In today's fast-paced world", no "Let's dive in".
- Instagram is @sculptcues (https://www.instagram.com/sculptcues/). Don't invent other social accounts. Mention Instagram only when it belongs in the post; don't ask readers to follow, tag or share as a default ending.

## Keywords (maximise, never stuff)
Each post has one primary keyword and 3–6 secondary keywords (from `seo_plan.md`).
- Primary keyword in: the title (near the start), the slug, the description, the first 100 words, at least one `##` heading, the image alt text, and the closing paragraph.
- Secondary keywords: one per `##` heading where it fits naturally, and once or twice in the body.
- Use semantic variants (e.g. "sculpt class plan", "sculpt class template", "sculpt class structure", "class format").
- Read every sentence aloud: if a keyword makes it clunky, rewrite or drop it. Natural reading always wins.

## Quality template
1. Title ≤ 70 characters ideally (max 90), primary keyword first. Description 140–165 characters.
2. Opening: answer the search question in the first 2–3 sentences.
3. 1,000–1,800 words for guides; 600–1,000 for quick tips.
4. At least one practical asset: a table, template, checklist or printable.
5. 2–4 internal links to other Journal posts or the homepage; at most 2 external links, to reputable sources.
6. A short "quick answers" section (2–4 questions in bold, one-paragraph answers) for AI answer engines. Plain Markdown; FAQ schema is not required.
7. Mention Sculpt Cues naturally at most twice; end with one sentence linking to the App Store: https://apps.apple.com/us/app/sculpt-cues-plan-your-class/id6831637468
8. No medical claims or injury diagnosis; say "check with a qualified professional" where relevant. No invented statistics, studies, quotes or testimonials. Region-specific facts (certifications, music licensing) must cite an official source.
9. No copied song lyrics.

## Images
- Allowed: our own app screenshots (`/img/`), our own HTML recreations of app screens, and official embeds.
- Official embeds only for other people's content: TikTok player iframe/embed code or Pinterest pin embed, with a visible credit linking to the creator's profile and the original post. Never download, screenshot or rehost other people's photos or videos.
- No AI-generated images.
- Every image needs descriptive alt text that includes the primary keyword where natural.

Embed pattern:
```html
<figure class="embed">
  <iframe src="https://www.tiktok.com/player/v1/VIDEO_ID?music_info=1&description=1" width="325" height="578" frameborder="0" allow="encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="What it shows, by @handle on TikTok"></iframe>
  <figcaption>What it shows, from <a href="https://www.tiktok.com/@handle">@handle</a> on TikTok. <a href="https://www.tiktok.com/@handle/video/VIDEO_ID">Watch on TikTok</a>.</figcaption>
</figure>
```

## Approval
- Posts 1–8 of the calendar: Zachary approves each PR before merge.
- After that: instructor how-to posts (planning, cueing, music, sequencing, teaching craft) may be merged without review.
- Health, injury, pregnancy, nutrition or legal/licensing posts always need Zachary's approval.

## File format
One Markdown file at `src/content/blog/<slug>.md`. Slug: lowercase, hyphenated, 3–7 words, contains the primary keyword.

```yaml
---
title: "How to plan a sculpt class: a 45-minute template"   # max 90 characters
description: "One or two sentences for search results."            # max 170 characters
pubDate: 2026-11-16                                          # the date the PR is merged
updatedDate: 2026-11-20                                      # optional, when meaningfully edited
author: "The Sculpt Cues Team"
tags: ["Class planning"]                                     # 1–3: Class planning, Cueing, Music, Muscle balance, Equipment, Teaching craft, Product, News
draft: false
---
```

Then the body in Markdown. Don't repeat the title as a heading (the page renders it as the H1).
