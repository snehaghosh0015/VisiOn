/* Home page: category chips, video grid, search results and library views. */
(function () {
  const grid = document.getElementById("grid");
  const chipsEl = document.getElementById("chips");
  const viewTitle = document.getElementById("viewTitle");
  const empty = document.getElementById("empty");

  const query = getParam("q") || "";
  const view = getParam("view") || "";
  const channelId = getParam("channel") || "";
  let activeCategory = getParam("cat") || "All";

  const VIEWS = {
    trending: { title: "Trending", list: () => [...VIDEOS].sort((a, b) => b.views - a.views) },
    subscriptions: {
      title: "Subscriptions",
      list: () => VIDEOS.filter((v) => Store.has("subscriptions", v.channel)),
      empty: ["No subscriptions yet", "Subscribe to a channel from any video page."],
    },
    history: {
      title: "Watch history",
      list: () => Store.get("history", []).map(getVideo).filter(Boolean),
      empty: ["Your history is empty", "Videos you watch will show up here."],
      clearable: true,
    },
    later: {
      title: "Watch later",
      list: () => Store.get("later", []).map(getVideo).filter(Boolean),
      empty: ["Nothing saved yet", "Click the clock icon on any video to save it for later."],
    },
    liked: {
      title: "Liked videos",
      list: () => Store.get("liked", []).map(getVideo).filter(Boolean),
      empty: ["No liked videos", "Videos you like will show up here."],
    },
  };

  function baseList() {
    if (VIEWS[view]) return VIEWS[view].list();
    if (channelId) return VIDEOS.filter((v) => v.channel === channelId);
    return VIDEOS;
  }

  function currentList() {
    let list = baseList().filter((v) => matchesQuery(v, query));
    if (activeCategory !== "All") list = list.filter((v) => v.tags.includes(activeCategory));
    if (activeCategory === "Recently uploaded") list.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
    return list;
  }

  function renderChips() {
    chipsEl.innerHTML = CATEGORIES.map(
      (c) =>
        `<button type="button" class="chip${c === activeCategory ? " active" : ""}" data-cat="${escapeHTML(c)}" aria-pressed="${c === activeCategory}">${escapeHTML(c)}</button>`
    ).join("");
  }

  function renderTitle() {
    let title = "";
    if (VIEWS[view]) title = VIEWS[view].title;
    else if (channelId && CHANNELS[channelId]) title = CHANNELS[channelId].name;
    else if (query) title = `Results for “${query}”`;

    viewTitle.hidden = !title;
    viewTitle.innerHTML = escapeHTML(title);

    if (VIEWS[view] && VIEWS[view].clearable && Store.get("history", []).length) {
      viewTitle.innerHTML += ` <button type="button" class="btn btn-ghost btn-sm" id="clearHistory">${icon("trash", 18)} Clear all</button>`;
    }
  }

  function cardHTML(video) {
    const channel = getChannel(video);
    const progress = getProgress(video.id);
    const saved = Store.has("later", video.id);
    return `
      <article class="card" data-id="${video.id}">
        <a class="thumb" href="${watchUrl(video)}" aria-label="${escapeHTML(video.title)}">
          <img src="${thumbUrl(video)}" alt="" loading="lazy" />
          <span class="duration">${video.duration}</span>
          ${progress > 0.02 ? `<span class="progress"><span style="width:${(progress * 100).toFixed(1)}%"></span></span>` : ""}
        </a>
        <div class="card-meta">
          ${avatarHTML(channel, 36, "a")}
          <div class="card-text">
            <h3 class="card-title"><a href="${watchUrl(video)}">${escapeHTML(video.title)}</a></h3>
            <a class="card-channel" href="index.html?channel=${channel.id}">${escapeHTML(channel.name)}${verifiedBadge(channel)}</a>
            <p class="card-stats">${formatViews(video.views)} · ${timeAgo(video.uploaded)}</p>
          </div>
          <button type="button" class="icon-btn icon-btn-sm save-later${saved ? " is-saved" : ""}" data-later="${video.id}" aria-label="${saved ? "Remove from" : "Save to"} Watch later" aria-pressed="${saved}">
            ${icon(saved ? "check" : "clock", 20)}
          </button>
        </div>
      </article>`;
  }

  function skeletons(n) {
    return Array.from({ length: n }, () => `<div class="card skeleton"><div class="thumb"></div><div class="sk-line"></div><div class="sk-line short"></div></div>`).join("");
  }

  function renderGrid() {
    const list = currentList();
    grid.innerHTML = list.map(cardHTML).join("");
    empty.hidden = list.length > 0;
    if (!list.length) {
      const [t, p] = (VIEWS[view] && VIEWS[view].empty && !query && activeCategory === "All")
        ? VIEWS[view].empty
        : ["No videos found", "Try a different search or category."];
      document.getElementById("emptyTitle").textContent = t;
      document.getElementById("emptyText").textContent = p;
    }
    renderTitle();
  }

  // Hover preview: play a muted clip on the thumbnail after a short pause.
  let hoverTimer;
  grid.addEventListener("mouseover", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb || thumb.querySelector("video") || window.matchMedia("(hover: none)").matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      const card = thumb.closest(".card");
      const video = card && getVideo(card.dataset.id);
      if (!video || !thumb.isConnected || thumb.querySelector("video")) return;
      const el = document.createElement("video");
      el.src = videoUrl(video);
      el.muted = true;
      el.autoplay = true;
      el.playsInline = true;
      el.className = "thumb-preview";
      thumb.appendChild(el);
      el.play().catch(() => {});
    }, 700);
  });
  grid.addEventListener("mouseout", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb || thumb.contains(e.relatedTarget)) return;
    clearTimeout(hoverTimer);
    const preview = thumb.querySelector("video");
    if (preview) preview.remove();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-later]");
    if (!btn) return;
    const added = Store.toggle("later", btn.dataset.later);
    showToast(added ? "Saved to Watch later" : "Removed from Watch later");
    renderGrid();
  });

  chipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    renderChips();
    renderGrid();
    chip.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  });

  viewTitle.addEventListener("click", (e) => {
    if (e.target.closest("#clearHistory")) {
      Store.set("history", []);
      Store.set("progress", {});
      showToast("Watch history cleared");
      renderGrid();
    }
  });

  if (query) document.title = `${query} — YouTube Clone`;
  else if (VIEWS[view]) document.title = `${VIEWS[view].title} — YouTube Clone`;

  renderChips();
  grid.innerHTML = skeletons(8);
  // Small delay so the skeleton loader is visible, like a real network fetch.
  setTimeout(renderGrid, 250);
})();
