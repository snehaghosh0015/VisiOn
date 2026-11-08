/* Shared helpers. */
const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function formatCount(n) {
  return compactNumber.format(n);
}

function formatViews(n) {
  return formatCount(n) + " views";
}

function timeAgo(dateInput) {
  const date = typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  for (const [unit, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function getVideo(id) {
  return VIDEOS.find((v) => v.id === id);
}

function getChannel(video) {
  return CHANNELS[video.channel];
}

function thumbUrl(video) {
  return "assets/thumbs/" + video.id + ".jpg";
}

function videoUrl(video) {
  return video.src;
}

function watchUrl(video) {
  return "watch.html?v=" + encodeURIComponent(video.id);
}

function avatarHTML(channel, size = 36, tag = "span") {
  const href = tag === "a" ? ` href="index.html?channel=${channel.id}"` : "";
  return `<${tag} class="avatar avatar-${size}" style="--avatar-color:${channel.color}"${href} aria-label="${escapeHTML(channel.name)}">${escapeHTML(channel.name.charAt(0))}</${tag}>`;
}

function verifiedBadge(channel) {
  return channel.verified ? `<span class="verified" title="Verified">${icon("check", 14)}</span>` : "";
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/** Video watch progress (0..1) remembered per video. */
function getProgress(id) {
  return Store.get("progress", {})[id] || 0;
}

function setProgress(id, ratio) {
  const map = Store.get("progress", {});
  map[id] = Math.min(1, Math.max(0, ratio));
  Store.set("progress", map);
}

let toastTimer;
function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function matchesQuery(video, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const channel = getChannel(video);
  return (
    video.title.toLowerCase().includes(q) ||
    channel.name.toLowerCase().includes(q) ||
    video.tags.some((t) => t.toLowerCase().includes(q)) ||
    video.description.toLowerCase().includes(q)
  );
}
