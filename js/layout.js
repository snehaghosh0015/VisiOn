/* Renders the shared header + side menu and wires up their behaviour. */
(function () {
  const body = document.body;
  const isHome = body.classList.contains("page-home");
  const currentView = getParam("view") || (isHome && !getParam("q") && !getParam("channel") ? "home" : "");

  const GUIDE_SECTIONS = [
    [
      { id: "home", label: "Home", icon: "home", href: "index.html" },
      { id: "trending", label: "Trending", icon: "trending", href: "index.html?view=trending" },
      { id: "subscriptions", label: "Subscriptions", icon: "subscriptions", href: "index.html?view=subscriptions" },
    ],
    [
      { id: "history", label: "History", icon: "history", href: "index.html?view=history" },
      { id: "later", label: "Watch later", icon: "clock", href: "index.html?view=later" },
      { id: "liked", label: "Liked videos", icon: "like", href: "index.html?view=liked" },
    ],
  ];

  const MINI_ITEMS = [
    { id: "home", label: "Home", icon: "home", href: "index.html" },
    { id: "trending", label: "Trending", icon: "trending", href: "index.html?view=trending" },
    { id: "subscriptions", label: "Subscriptions", icon: "subscriptions", href: "index.html?view=subscriptions" },
    { id: "library", label: "You", icon: "library", href: "index.html?view=history" },
  ];

  function guideItem(item) {
    const active = item.id === currentView ? " active" : "";
    return `<a class="guide-item${active}" href="${item.href}">${icon(item.icon)}<span>${item.label}</span></a>`;
  }

  function renderHeader() {
    const query = getParam("q") || "";
    document.getElementById("masthead").innerHTML = `
      <div class="masthead-start">
        <button class="icon-btn" id="guideToggle" type="button" aria-label="Open menu">${icon("menu")}</button>
        <a class="logo" href="index.html" aria-label="YouTube Clone home">
          ${LOGO_SVG}<span class="logo-text">YouTube</span><sup class="logo-tag">CLONE</sup>
        </a>
      </div>

      <div class="masthead-center">
        <button class="icon-btn search-back" id="searchBack" type="button" aria-label="Close search">${icon("back")}</button>
        <form class="search" id="searchForm" action="index.html" role="search">
          <div class="search-box">
            <span class="search-inner-icon">${icon("search", 20)}</span>
            <input id="searchInput" name="q" type="search" placeholder="Search" value="${escapeHTML(query)}" autocomplete="off" aria-label="Search" />
            <ul class="suggestions" id="suggestions" role="listbox" hidden></ul>
          </div>
          <button class="search-btn" type="submit" aria-label="Search">${icon("search")}</button>
        </form>
        <button class="icon-btn mic-btn" type="button" aria-label="Search with your voice" id="micBtn">${icon("mic")}</button>
      </div>

      <div class="masthead-end">
        <button class="icon-btn search-open" id="searchOpen" type="button" aria-label="Search">${icon("search")}</button>
        <button class="icon-btn hide-sm" type="button" aria-label="Create" data-toast="Uploading isn't available in this demo">${icon("create")}</button>
        <button class="icon-btn notif hide-sm" type="button" aria-label="Notifications" data-toast="You're all caught up!">${icon("bell")}<span class="notif-badge">3</span></button>
        <button class="avatar avatar-32 avatar-me" type="button" aria-label="Your account" data-toast="Signed in as You">Y</button>
      </div>`;
  }

  function renderGuide() {
    const subs = Store.get("subscriptions", []);
    const subsHTML = subs.length
      ? subs
          .map((id) => CHANNELS[id])
          .filter(Boolean)
          .map(
            (c) =>
              `<a class="guide-item" href="index.html?channel=${c.id}">${avatarHTML(c, 24)}<span>${escapeHTML(c.name)}</span></a>`
          )
          .join("")
      : `<p class="guide-note">Subscribe to channels to see them here.</p>`;

    const sections = GUIDE_SECTIONS.map(
      (section, i) =>
        `<div class="guide-section">${i === 1 ? '<h3 class="guide-heading">You</h3>' : ""}${section.map(guideItem).join("")}</div>`
    ).join("");

    document.getElementById("guide-root").innerHTML = `
      <nav class="guide" id="guide" aria-label="Main menu">
        ${sections}
        <div class="guide-section">
          <h3 class="guide-heading">Subscriptions</h3>
          ${subsHTML}
        </div>
        <div class="guide-section">
          <h3 class="guide-heading">Explore</h3>
          <a class="guide-item" href="index.html?cat=Animation">${icon("music")}<span>Animation</span></a>
          <a class="guide-item" href="index.html?cat=Nature">${icon("gaming")}<span>Nature</span></a>
          <a class="guide-item" href="index.html?cat=Trailers">${icon("trending")}<span>Trailers</span></a>
        </div>
        <footer class="guide-footer">
          <p>About · Press · Copyright · Contact · Creators · Developers</p>
          <p>A learning project built with HTML5, CSS3 & JavaScript.</p>
        </footer>
      </nav>
      <nav class="mini-guide" aria-label="Mini menu">
        ${MINI_ITEMS.map(
          (item) =>
            `<a class="mini-item${item.id === currentView ? " active" : ""}" href="${item.href}">${icon(item.icon)}<span>${item.label}</span></a>`
        ).join("")}
      </nav>
      <div class="backdrop" id="backdrop"></div>`;
  }

  function wireUp() {
    const toggle = document.getElementById("guideToggle");
    const backdrop = document.getElementById("backdrop");

    toggle.addEventListener("click", () => {
      if (isHome && window.innerWidth > 1312) body.classList.toggle("guide-collapsed");
      else body.classList.toggle("drawer-open");
    });
    backdrop.addEventListener("click", () => body.classList.remove("drawer-open"));
    window.addEventListener("resize", () => body.classList.remove("drawer-open"));

    // Search: suggestions + mobile expand
    const input = document.getElementById("searchInput");
    const form = document.getElementById("searchForm");
    const list = document.getElementById("suggestions");

    form.addEventListener("submit", (e) => {
      if (!input.value.trim()) {
        e.preventDefault();
        input.focus();
      }
    });

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        list.hidden = true;
        return;
      }
      const matches = VIDEOS.filter((v) => matchesQuery(v, q)).slice(0, 6);
      list.innerHTML = matches
        .map((v) => `<li role="option"><a href="${watchUrl(v)}">${icon("search", 18)}<span>${escapeHTML(v.title)}</span></a></li>`)
        .join("");
      list.hidden = matches.length === 0;
    });
    input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 150));

    document.getElementById("searchOpen").addEventListener("click", () => {
      body.classList.add("search-open");
      input.focus();
    });
    document.getElementById("searchBack").addEventListener("click", () => body.classList.remove("search-open"));

    document.getElementById("micBtn").addEventListener("click", () => showToast("Voice search isn't available in this demo"));
    document.querySelectorAll("[data-toast]").forEach((btn) =>
      btn.addEventListener("click", () => showToast(btn.dataset.toast))
    );

    // "/" focuses search like on YouTube
    document.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea") {
        e.preventDefault();
        input.focus();
        input.select();
      }
      if (e.key === "Escape") body.classList.remove("drawer-open", "search-open");
    });
  }

  renderHeader();
  renderGuide();
  wireUp();

  window.refreshGuide = renderGuide;
})();
