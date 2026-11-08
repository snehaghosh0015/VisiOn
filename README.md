# YouTube Clone (HTML5 · CSS3 · JavaScript)

A responsive YouTube-style video site built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step.

## Features

- Home feed with category chips, skeleton loading and hover video previews
- Live search suggestions and search results (press `/` to focus search)
- Collapsible side menu, mini menu and mobile drawer
- Watch page with HTML5 video player, resume-where-you-left-off and theater mode
- Like / dislike, subscribe, share (copy link) and Save to Watch later
- Expandable description, comments (add, delete, like, sort)
- Up next list with autoplay countdown
- Library pages: History, Watch later, Liked videos, Subscriptions
- Everything you do is saved in your browser (`localStorage`)
- Keyboard shortcuts on the watch page: `k`/space play-pause, `j`/`l` seek 10s, `m` mute, `f` fullscreen, `t` theater

## Project structure

```
youtube-clone/
├── index.html          # Home feed, search results and library views
├── watch.html          # Video watch page
├── assets/
│   ├── favicon.svg
│   └── thumbs/         # Video thumbnails (one .jpg per video id)
├── css/
│   ├── style.css       # Design tokens, reset, header, side menu, shared UI
│   ├── home.css        # Chips, video grid, skeletons, empty state
│   └── watch.css       # Player, actions, description, comments, up next
└── js/
    ├── icons.js        # SVG icon set
    ├── data.js         # Sample videos, channels and comments
    ├── storage.js      # localStorage helpers
    ├── utils.js        # Formatting and shared helpers
    ├── layout.js       # Header + side menu rendering and behaviour
    ├── home.js         # Home page logic
    └── watch.js        # Watch page logic
```

## Run locally

Open `index.html` in your browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Push to your GitHub repository

```bash
cd youtube-clone
git init
git add .
git commit -m "YouTube clone in HTML, CSS and JavaScript"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

To host it for free, enable **GitHub Pages** in your repo: Settings → Pages → Deploy from branch → `main` / root.

## Credits

Videos are openly licensed clips streamed from their public hosts: the Blender Foundation open movies (Big Buck Bunny, Sintel, Tears of Steel, Elephants Dream — Creative Commons, via archive.org and W3C), plus Video.js, MDN (CC0) and test-videos.co.uk samples. To add your own, drop a thumbnail in `assets/thumbs/` and add an entry to `js/data.js`. This is an educational project and is not affiliated with YouTube.
