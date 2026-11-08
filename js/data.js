/*
 * Sample catalogue.
 * Videos are free, openly licensed clips (Blender Foundation open movies, W3C/Video.js/MDN samples).
 * Thumbnails live in assets/thumbs so they always load.
 */
const CATEGORIES = ["All", "Animation", "Sci-Fi", "Short films", "Trailers", "Nature", "Recently uploaded"];

const CHANNELS = {
  blender: { id: "blender", name: "Blender Studio", subs: 3140000, verified: true, color: "#ff7a1a" },
  trailers: { id: "trailers", name: "Open Movie Trailers", subs: 862000, verified: true, color: "#3ea6ff" },
  nature: { id: "nature", name: "Nature Lens", subs: 418000, verified: false, color: "#2ecc71" },
};

const VIDEOS = [
  {
    id: "big-buck-bunny",
    src: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    title: "Big Buck Bunny — Full Animated Short Film",
    channel: "blender",
    views: 48210933,
    likes: 812000,
    uploaded: "2024-04-10",
    duration: "9:56",
    tags: ["Animation", "Short films"],
    description:
      "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore!\n\nAn open movie made with Blender. Licensed under Creative Commons Attribution 3.0.",
  },
  {
    id: "sintel",
    src: "https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4",
    title: "Sintel — A Lonely Young Woman Searches for Her Dragon",
    channel: "blender",
    views: 27400120,
    likes: 640000,
    uploaded: "2025-01-18",
    duration: "14:48",
    tags: ["Animation", "Short films"],
    description:
      "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend.\n\nAn open movie by the Blender Foundation.",
  },
  {
    id: "tears-of-steel",
    src: "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    title: "Tears of Steel — Sci-Fi Short Film (Live Action + VFX)",
    channel: "blender",
    views: 15830201,
    likes: 330000,
    uploaded: "2025-06-03",
    duration: "12:14",
    tags: ["Sci-Fi", "Short films"],
    description:
      "In an apocalyptic future, a group of soldiers and scientists takes refuge in Amsterdam to try to stop an army of robots that threatens the planet.",
  },
  {
    id: "oceans",
    src: "https://vjs.zencdn.net/v/oceans.mp4",
    title: "Oceans — Life Beneath the Waves",
    channel: "nature",
    views: 3400100,
    likes: 76000,
    uploaded: "2026-10-22",
    duration: "0:46",
    tags: ["Nature", "Recently uploaded"],
    description: "Dive into the deep blue. Birds, waves and the creatures of the open sea.",
  },
  {
    id: "sintel-trailer",
    src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    title: "Sintel — Official Trailer",
    channel: "trailers",
    views: 2104000,
    likes: 41000,
    uploaded: "2026-09-28",
    duration: "0:52",
    tags: ["Trailers", "Animation"],
    description: "The official trailer for Sintel, the third open movie from the Blender Foundation.",
  },
  {
    id: "elephants-dream",
    src: "https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4",
    title: "Elephants Dream — The World's First Open Movie",
    channel: "blender",
    views: 9120554,
    likes: 201000,
    uploaded: "2023-09-02",
    duration: "10:53",
    tags: ["Animation", "Sci-Fi", "Short films"],
    description:
      "Two characters, Emo and Proog, explore a strange machine-like world in this surreal short.\n\nMade entirely with open-source tools.",
  },
  {
    id: "jellyfish",
    src: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_5MB.mp4",
    title: "Jellyfish in Slow Motion — 10 Seconds of Calm",
    channel: "nature",
    views: 990000,
    likes: 15200,
    uploaded: "2026-11-02",
    duration: "0:10",
    tags: ["Nature", "Recently uploaded"],
    description: "Just breathe. A pacific sea nettle drifting through the water.",
  },
  {
    id: "bunny-trailer",
    src: "https://media.w3.org/2010/05/bunny/trailer.mp4",
    title: "Big Buck Bunny — Official Trailer",
    channel: "trailers",
    views: 1830000,
    likes: 28000,
    uploaded: "2026-08-14",
    duration: "0:33",
    tags: ["Trailers", "Animation"],
    description: "Meet Big Buck Bunny and the three rodents who picked the wrong rabbit.",
  },
  {
    id: "flower",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    title: "Flower Blooming — Macro Timelapse",
    channel: "nature",
    views: 455000,
    likes: 12000,
    uploaded: "2026-10-05",
    duration: "0:05",
    tags: ["Nature", "Recently uploaded"],
    description: "A tiny flower opening up in the morning sun, filmed up close. (CC0)",
  },
];

const SAMPLE_COMMENTERS = [
  { name: "@pixelpioneer", color: "#8e44ad" },
  { name: "@nightowl_films", color: "#16a085" },
  { name: "@sunny.days", color: "#d35400" },
  { name: "@thecuriouscat", color: "#2980b9" },
  { name: "@retro_rewind", color: "#c0392b" },
  { name: "@deepblue99", color: "#27ae60" },
];

const SAMPLE_COMMENT_TEXT = [
  "This never gets old. Watching it again in 2026!",
  "The attention to detail here is unreal.",
  "Who else came back here after all these years?",
  "The music in this is so underrated.",
  "Honestly better than most big-budget releases.",
  "Saving this to show my friends later.",
  "The pacing is perfect, not a second wasted.",
  "Came for 5 minutes, stayed for the whole thing.",
];
