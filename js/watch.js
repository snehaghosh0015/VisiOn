/* Watch page: player, actions, description, comments and the up-next list. */
(function () {
  const video = getVideo(getParam("v")) || VIDEOS[0];
  const channel = getChannel(video);
  const player = document.getElementById("player");
  const $ = (id) => document.getElementById(id);

  document.title = `${video.title} — YouTube Clone`;
  Store.pushHistory(video.id);

  /* ---------- Player ---------- */
  player.src = videoUrl(video);
  player.poster = thumbUrl(video);

  const savedProgress = getProgress(video.id);
  player.addEventListener("loadedmetadata", () => {
    if (savedProgress > 0.02 && savedProgress < 0.97) {
      player.currentTime = savedProgress * player.duration;
      showToast("Resuming where you left off");
    }
  });

  let lastSave = 0;
  player.addEventListener("timeupdate", () => {
    if (!player.duration || Date.now() - lastSave < 2000) return;
    lastSave = Date.now();
    setProgress(video.id, player.currentTime / player.duration);
  });

  player.play().catch(() => {
    /* autoplay blocked — user can press play */
  });

  // Keyboard shortcuts: k/space play-pause, j/l seek, m mute, f fullscreen, t theater
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey) return;
    const key = e.key.toLowerCase();
    if (key === "k" || (key === " " && e.target === document.body)) {
      e.preventDefault();
      player.paused ? player.play() : player.pause();
    } else if (key === "j") player.currentTime = Math.max(0, player.currentTime - 10);
    else if (key === "l") player.currentTime = Math.min(player.duration || 0, player.currentTime + 10);
    else if (key === "m") player.muted = !player.muted;
    else if (key === "f") {
      document.fullscreenElement ? document.exitFullscreen() : $("playerWrap").requestFullscreen?.();
    } else if (key === "t") toggleTheater();
  });

  /* ---------- Title, owner, actions ---------- */
  $("title").textContent = video.title;

  const ownerAvatar = $("ownerAvatar");
  ownerAvatar.style.setProperty("--avatar-color", channel.color);
  ownerAvatar.textContent = channel.name.charAt(0);
  ownerAvatar.href = `index.html?channel=${channel.id}`;
  $("ownerName").innerHTML = escapeHTML(channel.name) + verifiedBadge(channel);
  $("ownerName").href = `index.html?channel=${channel.id}`;

  function renderSubscribe() {
    const subscribed = Store.has("subscriptions", channel.id);
    const btn = $("subscribeBtn");
    btn.textContent = subscribed ? "Subscribed" : "Subscribe";
    btn.classList.toggle("is-subscribed", subscribed);
    btn.setAttribute("aria-pressed", subscribed);
    $("ownerSubs").textContent = formatCount(channel.subs + (subscribed ? 1 : 0)) + " subscribers";
  }
  $("subscribeBtn").addEventListener("click", () => {
    const now = Store.toggle("subscriptions", channel.id);
    showToast(now ? `Subscribed to ${channel.name}` : "Subscription removed");
    renderSubscribe();
    window.refreshGuide && window.refreshGuide();
  });

  function renderRatings() {
    const liked = Store.has("liked", video.id);
    const disliked = Store.has("disliked", video.id);
    const likeBtn = $("likeBtn");
    const dislikeBtn = $("dislikeBtn");
    likeBtn.innerHTML = `${icon("like", 22)}<span>${formatCount(video.likes + (liked ? 1 : 0))}</span>`;
    dislikeBtn.innerHTML = icon("dislike", 22);
    likeBtn.classList.toggle("is-active", liked);
    dislikeBtn.classList.toggle("is-active", disliked);
    likeBtn.setAttribute("aria-pressed", liked);
    dislikeBtn.setAttribute("aria-pressed", disliked);
  }
  $("likeBtn").addEventListener("click", () => {
    const now = Store.toggle("liked", video.id);
    if (now) Store.remove("disliked", video.id);
    showToast(now ? "Added to Liked videos" : "Removed from Liked videos");
    renderRatings();
  });
  $("dislikeBtn").addEventListener("click", () => {
    const now = Store.toggle("disliked", video.id);
    if (now) Store.remove("liked", video.id);
    renderRatings();
  });

  $("shareBtn").innerHTML = `${icon("share", 22)}<span>Share</span>`;
  $("shareBtn").addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: video.title, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard");
      }
    } catch (e) {
      /* share cancelled */
    }
  });

  function renderSave() {
    const saved = Store.has("later", video.id);
    $("saveBtn").innerHTML = `${icon(saved ? "saved" : "save", 22)}<span>${saved ? "Saved" : "Save"}</span>`;
    $("saveBtn").setAttribute("aria-pressed", saved);
  }
  $("saveBtn").addEventListener("click", () => {
    const now = Store.toggle("later", video.id);
    showToast(now ? "Saved to Watch later" : "Removed from Watch later");
    renderSave();
  });

  function toggleTheater() {
    const on = document.body.classList.toggle("theater");
    Store.set("theater", on);
    $("theaterBtn").setAttribute("aria-pressed", on);
  }
  $("theaterBtn").innerHTML = `${icon("theater", 22)}<span>Theater</span>`;
  $("theaterBtn").addEventListener("click", toggleTheater);
  if (Store.get("theater", false)) {
    document.body.classList.add("theater");
    $("theaterBtn").setAttribute("aria-pressed", "true");
  }

  /* ---------- Description ---------- */
  const uploaded = new Date(video.uploaded);
  $("descStats").textContent = `${video.views.toLocaleString("en")} views  ${uploaded.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}  ${video.tags.map((t) => "#" + t.replace(/\s|-/g, "")).join(" ")}`;
  $("descBody").innerHTML = video.description
    .split("\n")
    .map((line) => `<p>${escapeHTML(line) || "&nbsp;"}</p>`)
    .join("");

  const desc = $("description");
  function setDescExpanded(expanded) {
    desc.classList.toggle("expanded", expanded);
    $("descToggle").textContent = expanded ? "Show less" : "...more";
  }
  desc.addEventListener("click", (e) => {
    if (e.target.closest("#descToggle")) {
      e.stopPropagation();
      setDescExpanded(!desc.classList.contains("expanded"));
    } else if (!desc.classList.contains("expanded")) setDescExpanded(true);
  });

  /* ---------- Comments ---------- */
  const commentsKey = "comments:" + video.id;
  let sortMode = "top";

  // Deterministic seed comments per video so they look stable between visits.
  function seededComments() {
    const seed = video.id.length;
    return SAMPLE_COMMENTERS.slice(0, 4 + (seed % 3)).map((author, i) => ({
      id: "seed-" + i,
      author: author.name,
      color: author.color,
      text: SAMPLE_COMMENT_TEXT[(seed + i) % SAMPLE_COMMENT_TEXT.length],
      likes: Math.round((video.likes / 40) * (1 / (i + 1))),
      time: Date.now() - (i + 1) * 86400000 * (3 + ((seed * (i + 2)) % 40)),
      mine: false,
    }));
  }

  function allComments() {
    const mine = Store.get(commentsKey, []);
    const list = [...mine, ...seededComments()];
    if (sortMode === "new") list.sort((a, b) => b.time - a.time);
    else list.sort((a, b) => (b.mine - a.mine) || b.likes - a.likes);
    return list;
  }

  function renderComments() {
    const liked = Store.get("commentLikes", []);
    const list = allComments();
    $("commentCount").textContent = list.length.toLocaleString("en");
    $("commentList").innerHTML = list
      .map((c) => {
        const key = video.id + ":" + c.id;
        const isLiked = liked.includes(key);
        return `
        <li class="comment">
          <span class="avatar avatar-40" style="--avatar-color:${c.color}">${escapeHTML(c.author.charAt(1).toUpperCase())}</span>
          <div class="comment-body">
            <p class="comment-head"><span class="comment-author${c.mine ? " is-me" : ""}">${escapeHTML(c.author)}</span><span class="comment-time">${timeAgo(c.time)}</span></p>
            <p class="comment-text">${escapeHTML(c.text)}</p>
            <div class="comment-actions">
              <button type="button" class="icon-btn icon-btn-sm${isLiked ? " is-active" : ""}" data-like-comment="${key}" aria-label="Like comment" aria-pressed="${isLiked}">${icon("like", 16)}</button>
              <span class="comment-likes">${c.likes + (isLiked ? 1 : 0) || ""}</span>
              <button type="button" class="icon-btn icon-btn-sm" aria-label="Dislike comment">${icon("dislike", 16)}</button>
              ${c.mine ? `<button type="button" class="btn btn-ghost btn-sm" data-delete-comment="${c.id}">Delete</button>` : ""}
            </div>
          </div>
        </li>`;
      })
      .join("");
  }

  $("commentList").addEventListener("click", (e) => {
    const likeBtn = e.target.closest("[data-like-comment]");
    if (likeBtn) {
      Store.toggle("commentLikes", likeBtn.dataset.likeComment);
      renderComments();
    }
    const delBtn = e.target.closest("[data-delete-comment]");
    if (delBtn) {
      Store.set(
        commentsKey,
        Store.get(commentsKey, []).filter((c) => c.id !== delBtn.dataset.deleteComment)
      );
      showToast("Comment deleted");
      renderComments();
    }
  });

  const input = $("commentInput");
  input.addEventListener("focus", () => ($("commentActions").hidden = false));
  input.addEventListener("input", () => ($("commentSubmit").disabled = !input.value.trim()));
  $("commentCancel").addEventListener("click", () => {
    input.value = "";
    $("commentSubmit").disabled = true;
    $("commentActions").hidden = true;
  });
  $("commentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const mine = Store.get(commentsKey, []);
    mine.unshift({ id: "me-" + Date.now(), author: "@you", color: "var(--brand)", text, likes: 0, time: Date.now(), mine: true });
    Store.set(commentsKey, mine);
    input.value = "";
    $("commentSubmit").disabled = true;
    $("commentActions").hidden = true;
    renderComments();
    showToast("Comment added");
  });

  const sortMenu = $("sortMenu");
  $("sortBtn").innerHTML = `${icon("sort")}<span>Sort by</span>`;
  $("sortBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    sortMenu.hidden = !sortMenu.hidden;
  });
  sortMenu.addEventListener("click", (e) => {
    const item = e.target.closest("[data-sort]");
    if (!item) return;
    sortMode = item.dataset.sort;
    sortMenu.querySelectorAll("[data-sort]").forEach((b) => b.classList.toggle("active", b === item));
    sortMenu.hidden = true;
    renderComments();
  });
  document.addEventListener("click", () => (sortMenu.hidden = true));

  /* ---------- Up next ---------- */
  const related = VIDEOS.filter((v) => v.id !== video.id).sort((a, b) => {
    const score = (v) => v.tags.filter((t) => video.tags.includes(t)).length * 10 + (v.channel === video.channel ? 5 : 0);
    return score(b) - score(a);
  });
  const nextVideo = related[0];

  $("related").innerHTML = related
    .map((v) => {
      const c = getChannel(v);
      const progress = getProgress(v.id);
      return `
      <li>
        <a class="related-item" href="${watchUrl(v)}">
          <span class="related-thumb">
            <img src="${thumbUrl(v)}" alt="" loading="lazy" />
            <span class="duration">${v.duration}</span>
            ${progress > 0.02 ? `<span class="progress"><span style="width:${(progress * 100).toFixed(1)}%"></span></span>` : ""}
          </span>
          <span class="related-text">
            <span class="related-title">${escapeHTML(v.title)}</span>
            <span class="related-channel">${escapeHTML(c.name)}${verifiedBadge(c)}</span>
            <span class="related-stats">${formatViews(v.views)} · ${timeAgo(v.uploaded)}</span>
          </span>
        </a>
      </li>`;
    })
    .join("");

  const autoplay = $("autoplayToggle");
  autoplay.checked = Store.get("autoplay", true);
  autoplay.addEventListener("change", () => {
    Store.set("autoplay", autoplay.checked);
    showToast(autoplay.checked ? "Autoplay is on" : "Autoplay is off");
  });

  let countdownTimer;
  player.addEventListener("ended", () => {
    setProgress(video.id, 1);
    if (!autoplay.checked || !nextVideo) return;
    const overlay = $("upNext");
    $("upNextThumb").src = thumbUrl(nextVideo);
    $("upNextTitle").textContent = nextVideo.title;
    $("upNextLink").href = watchUrl(nextVideo);
    $("playUpNext").href = watchUrl(nextVideo);
    overlay.hidden = false;
    let left = 5;
    $("countdown").textContent = left;
    countdownTimer = setInterval(() => {
      left -= 1;
      $("countdown").textContent = left;
      if (left <= 0) {
        clearInterval(countdownTimer);
        window.location.href = watchUrl(nextVideo);
      }
    }, 1000);
  });
  $("cancelUpNext").addEventListener("click", () => {
    clearInterval(countdownTimer);
    $("upNext").hidden = true;
  });
  player.addEventListener("play", () => {
    clearInterval(countdownTimer);
    $("upNext").hidden = true;
  });

  renderSubscribe();
  renderRatings();
  renderSave();
  renderComments();
})();
