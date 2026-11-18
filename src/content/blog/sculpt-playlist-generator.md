---
title: "Sculpt playlist generator: build a class playlist to the minute"
description: "A free sculpt playlist generator: pick your class length and energy, and get an ordered song list with every track's length and the total, ready to copy into Notes."
pubDate: 2026-11-18
author: "The Sculpt Cues Team"
tags: ["Music", "Class planning"]
faq:
  - q: "How does the sculpt playlist generator work?"
    a: "Choose a class length and a style. The generator picks real songs from public sculpt and barre playlists, orders them warm-up, build, peak and cool-down, and gets the total as close to your class length as it can."
  - q: "Is the sculpt playlist generator free?"
    a: "Yes. It runs in your browser, needs no sign-up and doesn't connect to your Spotify account."
  - q: "Can I use it as a workout playlist generator for other classes?"
    a: "Yes, for any music-led class with a warm-up, a peak and a cool-down, such as barre or mat Pilates. The songs are picked with sculpt tempos in mind."
draft: false
---

Our free sculpt playlist generator builds a class playlist to the minute. Pick how long your class is, choose an energy, and it gives you an ordered list of real songs with each track's length and the total. Tap **Copy for Notes** and the list is on your phone.

<div class="sc-gen" id="sc-gen">
  <div class="sc-gen-controls">
    <div class="sc-gen-row" role="group" aria-label="Class length">
      <span class="sc-gen-label">Class length (minutes)</span>
      <button type="button" class="pill" data-minutes="30" aria-pressed="false">30</button>
      <button type="button" class="pill on" data-minutes="45" aria-pressed="true">45</button>
      <button type="button" class="pill" data-minutes="50" aria-pressed="false">50</button>
      <button type="button" class="pill" data-minutes="60" aria-pressed="false">60</button>
      <input type="number" id="sc-gen-minutes" min="10" max="120" step="1" value="45" inputmode="numeric" aria-label="Custom class length in minutes" />
    </div>
    <div class="sc-gen-row" role="group" aria-label="Class style">
      <span class="sc-gen-label">Energy</span>
      <button type="button" class="pill" data-style="steady" aria-pressed="false">Steady</button>
      <button type="button" class="pill on" data-style="balanced" aria-pressed="true">Balanced</button>
      <button type="button" class="pill" data-style="high" aria-pressed="false">High energy</button>
    </div>
    <div class="sc-gen-row">
      <label class="sc-check"><input type="checkbox" id="sc-gen-clean" checked /> Clean tracks only (no songs marked explicit on Spotify)</label>
    </div>
  </div>
  <ol class="sc-gen-list" aria-live="polite"><li><span class="sc-song">Loading songs…</span><span class="sc-dur"></span></li></ol>
  <div class="sc-gen-total"><span>Total</span><span>–</span></div>
  <div class="sc-gen-actions">
    <button type="button" class="btn btn-primary" data-action="regen">Regenerate</button>
    <button type="button" class="btn btn-ghost" data-copy-target="sc-gen-text">Copy for Notes</button>
  </div>
  <p class="sc-gen-status" role="status"></p>
  <pre id="sc-gen-text" hidden></pre>
  <noscript><p class="sc-gen-status">The generator needs JavaScript. Our <a href="/blog/sculpt-class-playlist/">free 45-minute sculpt class playlist</a> is a ready-made alternative.</p></noscript>
</div>

<script type="module" src="/tools/playlist-generator-ui.mjs"></script>
<script src="/tools/copy-button.js" defer></script>

## How to use the sculpt playlist generator

1. **Pick your class length.** Tap 30, 45, 50 or 60, or type any length from 10 to 120 minutes.
2. **Choose an energy.** Balanced gives roughly equal time to building and peaking. High energy spends more of the class at the top. Steady keeps most songs in the build range, which suits a slower, strength-focused sculpt class.
3. **Keep it clean, or don't.** Clean tracks only is on by default. Turn it off if explicit lyrics are fine in your room.
4. **Regenerate until you like it.** Each tap gives a new mix with the same shape. Tap a song title to open it in Spotify.
5. **Copy for Notes.** You get a plain-text list of song titles, artists, each song's length and the total, which pastes cleanly into your phone's Notes app.

Every playlist follows the same arc: warm-up first, building tracks next, the peak tracks in the middle, one building track to come down, then the cool-down. The generator fills the time as closely as it can. Most results land within a few seconds of your class length.

## Why song length matters when you time a sculpt class

In a music-led class, the song is the clock. Most sculpt teachers give one song to each segment of class, so when a track ends, the room moves on. That's why the length of each song matters as much as its tempo.

- **Three to four minutes** suits a strength segment: full-range reps, then a hold, then pulses.
- **Shorter tracks** are great for a burnout, as long as you're not teaching something new in that window.
- **Know your total before class.** If the playlist runs four minutes over, something gets rushed, usually the cool-down.

Seeing every song's length up front lets you plan each segment to fit, instead of finding out mid-class that the finisher track ends after 2:10. For tempo ranges by segment, see our guide to [sculpt class music and BPM](/blog/sculpt-class-music-bpm/).

## Where the songs come from

We don't make up songs or round off lengths. Every track in the generator comes from a public, credited Spotify playlist made for sculpt, barre or HIIT yoga classes, and each length is the one Spotify lists for that track:

- [HIGH ENERGY SCULPT PILATES](https://open.spotify.com/playlist/7LlrUyiNqvDIrEPRxo8MTW) by Lizzie Schramm
- [Pure Barre Classic - February 2026](https://open.spotify.com/playlist/5l0MBKcBXfbYp7TYNXF7kb) by Jenny Chapin
- [Sculpt (HIIT Yoga)](https://open.spotify.com/playlist/5hIvx0tqcHOBLklhGGeQxd) by Gus Horner

There are 147 songs in the pool. We sorted each song into warm-up, build, peak or cool-down using its tempo on [SongBPM](https://songbpm.com/), a free BPM finder, then moved a few upbeat tracks out of the cool-down by ear, so the sequence has a sensible arc. Treat those roles as a starting point: a song's feel matters as much as its BPM, so listen through before class and swap anything that doesn't suit your room.

## Turn the sculpt playlist into a class plan

A song list is half the plan. The next step is deciding which Movements go with each song.

1. **Give each song a segment.** Warm-up, standing legs, upper body, glutes, core, finisher and cool-down is a solid order for a 45-minute class.
2. **Write three or four Movements per segment.** Layer them: full range first, then a hold, then pulses.
3. **Check the clock.** Write the running time next to each segment, so you know where you should be.

If you want a finished example, our [free 45-minute sculpt class playlist](/blog/sculpt-class-playlist/) does exactly this: 14 songs, each with a segment, a cumulative time and four Movements, ready to paste into Notes.

You can also take the generated list into Sculpt Cues. Each song becomes a Segment, you add the Movements that sit within it, and the Segments build your Flow. Cue Coach can pick up the beat of the song playing in the room and pulse your cues at half, single or double time.

## Sculpt playlist generator: quick answers

**How does the sculpt playlist generator work?** Choose a class length and a style. The generator picks real songs from public sculpt and barre playlists, orders them warm-up, build, peak and cool-down, and gets the total as close to your class length as it can.

**Is the sculpt playlist generator free?** Yes. It runs in your browser, needs no sign-up and doesn't connect to your Spotify account.

**Can I use it as a workout playlist generator for other classes?** Yes, for any music-led class with a warm-up, a peak and a cool-down, such as barre or mat Pilates. The songs are picked with sculpt tempos in mind.

Generate your next sculpt playlist above, and when you're ready to plan the Movements for each Segment, <a href="https://apps.apple.com/app/apple-store/id6831637468?pt=128746925&ct=site-blog-sculpt-playlist-generator&mt=8" data-app-store>get Sculpt Cues on the App Store</a>.
