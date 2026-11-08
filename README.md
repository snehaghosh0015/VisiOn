# 🎬 YouTube Clone

A responsive **YouTube-style video streaming website** built using **HTML5, CSS3, and Vanilla JavaScript** — with no frameworks and no build tools required.

This project recreates the core experience of a modern video-sharing platform, including a home feed, video watch page, search, comments, subscriptions, watch history, and personalized browser-based storage.

> **Note:** This is an educational project and is not affiliated with or endorsed by YouTube.

---

## ✨ Features

### 🏠 Home Page

- Responsive YouTube-style home feed
- Category/filter chips
- Video cards with thumbnails
- Skeleton loading animation
- Hover video previews
- Responsive video grid

### 🔎 Search

- Live search suggestions
- Search results page
- `/` keyboard shortcut to focus the search bar
- Search videos by title, channel, or category

### 📺 Watch Page

- HTML5 video player
- Resume video from where you stopped watching
- Theater mode
- Video progress tracking
- Autoplay countdown
- Up Next video list

### 👍 Video Actions

- Like / dislike videos
- Subscribe to channels
- Share videos by copying their link
- Save videos to **Watch Later**

### 💬 Comments

- Add new comments
- Delete your comments
- Like comments
- Sort comments
- Expandable video description

### 📚 Library

Personalized library sections including:

- History
- Watch Later
- Liked Videos
- Subscriptions

### 💾 Local Storage

All user interactions are stored using the browser's `localStorage`, including:

- Watch history
- Liked videos
- Subscriptions
- Watch Later videos
- Comments
- Video progress

No external database is required.

### ⌨️ Keyboard Shortcuts

| Shortcut      | Action                   |
| ------------- | ------------------------ |
| `K` / `Space` | Play / Pause             |
| `J`           | Seek backward 10 seconds |
| `L`           | Seek forward 10 seconds  |
| `M`           | Mute / Unmute            |
| `F`           | Fullscreen               |
| `T`           | Theater Mode             |
| `/`           | Focus Search             |

---

## 🛠️ Technologies Used

- **HTML5** — Website structure
- **CSS3** — Responsive styling and layouts
- **JavaScript (ES6+)** — Application logic and interactions
- **HTML5 Video API** — Video playback and controls
- **LocalStorage API** — Persistent browser data
- **SVG** — Interface icons

### No Frameworks Required

This project uses:

- ❌ React
- ❌ Vue
- ❌ Angular
- ❌ Bootstrap
- ❌ Build tools

Everything is implemented using **plain HTML, CSS, and JavaScript**.

---

## 📁 Project Structure

```text
youtube-clone/
│
├── index.html
│   └── Home feed, search results and library views
│
├── watch.html
│   └── Video watch page
│
├── assets/
│   ├── favicon.svg
│   └── thumbs/
│       └── Video thumbnails
│
├── css/
│   ├── style.css
│   │   └── Global styles, header, sidebar and shared UI
│   │
│   ├── home.css
│   │   └── Home feed, video grid, chips and skeleton loading
│   │
│   └── watch.css
│       └── Video player, actions, description and comments
│
└── js/
    ├── icons.js
    │   └── SVG icon collection
    │
    ├── data.js
    │   └── Sample videos, channels and comments
    │
    ├── storage.js
    │   └── LocalStorage functions
    │
    ├── utils.js
    │   └── Shared utility and formatting functions
    │
    ├── layout.js
    │   └── Header, sidebar and navigation behaviour
    │
    ├── home.js
    │   └── Home page and search functionality
    │
    └── watch.js
        └── Video player, comments and watch-page functionality
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git
```

### 2. Open the Project

Navigate into the project folder:

```bash
cd youtube-clone
```

### 3. Run the Website

You can simply open:

```text
index.html
```

in your browser.

Alternatively, use a local development server.

#### Using Python

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

#### Using `npx serve`

```bash
npx serve .
```

---

## 🎥 Video Content

The project uses openly licensed/test video clips from public hosts.

Examples include:

- Big Buck Bunny
- Sintel
- Tears of Steel
- Elephants Dream
- Video.js sample videos
- MDN test media
- test-videos.co.uk samples

These are used for educational and demonstration purposes.

To add your own video:

1. Add a thumbnail to:

```text
assets/thumbs/
```

2. Add the corresponding video information to:

```text
js/data.js
```

3. Refresh the website.

---

## 💾 Data Storage

This project does not require a backend database.

User interactions are stored locally in the browser using the **Web Storage API (`localStorage`)**.

For example:

```text
Liked Videos
      ↓
localStorage
      ↓
Browser Storage
      ↓
Data restored when the website is reopened
```

This allows the application to maintain user preferences and activity between sessions.

---

## 📱 Responsive Design

The interface is designed to work across different screen sizes:

- 🖥️ Desktop
- 💻 Laptop
- 📱 Mobile
- 📟 Tablet

The sidebar automatically adapts to smaller screens using a mobile drawer layout.

---

## 🌟 Main Pages

### Home

The home page provides:

- Navigation sidebar
- Search bar
- Category chips
- Video grid
- Video previews
- Recommended videos

### Watch

The watch page includes:

- Video player
- Video title
- Channel information
- Like/dislike buttons
- Subscribe button
- Share button
- Watch Later button
- Description
- Comments
- Up Next videos

### Library

The library provides access to:

- History
- Watch Later
- Liked Videos
- Subscriptions

---

## 🔮 Future Improvements

Possible future enhancements include:

- User authentication
- Backend database
- Real-time comments
- Video uploading
- User profiles
- Creator dashboard
- Video recommendations using an algorithm
- Playlist creation
- Notification system
- Dark/light theme switching
- Cloud-based user data synchronization
- Admin dashboard
- Video streaming backend

---

## 📸 Screenshots

Add screenshots of your project here after running the application.

Example:

```text
screenshots/
├── home.png
├── search.png
├── watch.png
└── library.png
```

Then add them to this README:

```markdown
![Home Page](screenshots/home.png)

![Watch Page](screenshots/watch.png)

![Library](screenshots/library.png)
```

---

## 📌 Project Highlights

This project demonstrates practical implementation of:

- DOM manipulation
- JavaScript event handling
- Responsive web design
- HTML5 video playback
- LocalStorage data persistence
- Search and filtering
- Dynamic UI rendering
- Reusable JavaScript modules
- Keyboard accessibility
- Component-style UI organization

---

## 👨‍💻 Author

**Sneha Ghosh**

GitHub: `https://github.com/<your-username>`

---

## 📄 License

This project is intended for **educational and demonstration purposes**.

The project itself is not affiliated with YouTube, Google, or any of their products or services.

Video content remains subject to the licenses and terms of its respective sources.

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub!

**Built with ❤️ using HTML, CSS & JavaScript.**
