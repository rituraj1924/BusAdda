# बस अड्डा | BusAdda 🚌

> **दिल्ली की सड़कों पर, यादों की सवारी**  
> *On Delhi's roads, a ride of memories*

A full-screen immersive ambient experience set inside a moving 1990s Delhi DTC (Delhi Transport Corporation) government bus. Inspired by [deluxsalon.in](https://deluxsalon.in), built for nostalgia.

---

## 🎨 What Is This?

BusAdda puts you inside a green-and-yellow DTC bus rolling through the streets of 1990s Old Delhi. It's not a website — it's a **vibe**. A moving, breathing, dusty, warm slice of Delhi that existed between 1988 and 1998.

Think: aunty with tiffin box, sleepy uncle, Sholay poster peeling off the wall, conductor shouting *"Aage badhiye!"*, 90s Bollywood on the radio, and outside — the chaos and beauty of Chandni Chowk flowing past your scratched window.

---

## 🚀 Quick Start

### Just open `index.html` in a browser

```bash
# Serve locally (required for Service Worker + YouTube API)
npx serve .
# or
python -m http.server 8080
# Then open: http://localhost:8080
```

> **Note:** Open via a local server (`localhost`), not directly as a file (`file://`), for YouTube embed and Service Worker to work.

---

## 🖼️ Features

### Three View Modes
| Mode | Hindi | Description |
|------|-------|-------------|
| Interior | अंदर से | Default passenger POV inside the bus |
| Driver | आगे से | Behind the driver, looking at Delhi traffic |
| Window | खिड़की से | Full-screen scrolling Delhi street view |

**Switch views:**
- Click the pill buttons at bottom-left
- Press `1`, `2`, `3` on keyboard
- Swipe left/right on mobile

### 🌧️ Rain Mode
Click the **बारिश?** toggle (bottom-right) to:
- Activate rain streaks on windows
- Darken the sky and landscape
- Start rain ambient sound + thunder
- Activate windshield wipers (driver view)

### 🎵 Bus Radio (90s Bollywood)
Embedded YouTube playlist of 90s Hindi film songs. Styled like an old analog radio with a spinning dial and warm orange glow.

**Songs include:**
- तुझे देखा तो — DDLJ (1995)
- कुछ कुछ होता है — K2H2 (1998)
- जादू तेरी नज़र — Darr (1993)
- Pehla Nasha — Jo Jeeta Wohi Sikandar (1992)
- And more...

### 🎟️ Conductor Quotes
Every 30–60 seconds, the bus conductor pops up with an authentic Hindi one-liner:
- *"आगे बढ़िए भाई, जगह है!"*
- *"टिकट लिया? नहीं लिया तो उतरो!"*
- *"कश्मीरी गेट? अगली सवारी।"*

### 🔊 Ambient Soundscape (Web Audio API)
Layered ambient audio generated programmatically:
- Bus engine rumble (brown noise + LFO tremolo)
- Wind from open windows (bandpass noise)
- Distant city sounds — traffic, crowd murmur
- Rain on metal roof (rain mode)
- Thunder rumble (rain mode, random)
- Bus horn honk (random, every 90–180 seconds)

### 🌟 Easter Egg
Click the **बस अड्डा** logo 5 times for a surprise! 🎉

---

## 📁 Project Structure

```
BusAdda/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest (installable)
├── sw.js                   # Service Worker (offline)
├── css/
│   ├── main.css            # Design system, variables, UI components
│   ├── bus-interior.css    # Bus interior scene layout
│   ├── animations.css      # All @keyframe animations
│   ├── rain.css            # Rain mode visual effects
│   └── views.css           # Three view mode styles
├── js/
│   ├── main.js             # App init, orchestration, easter egg
│   ├── audio.js            # Web Audio API ambient engine
│   ├── rain.js             # Rain toggle controller
│   ├── conductor.js        # Rotating Hindi quote system
│   ├── views.js            # View switching, swipe gestures
│   └── youtube.js          # YouTube IFrame API player
├── assets/
│   └── images/
│       ├── bus-interior.jpg    # AI-generated 1990s DTC bus interior
│       ├── driver-view.jpg     # AI-generated driver POV
│       └── delhi-street.jpg    # AI-generated Delhi street panorama
└── docs/
    ├── README.md           # This file
    ├── ARCHITECTURE.md     # Technical architecture deep-dive
    └── DESIGN.md           # Design system documentation
```

---

## 🎨 Design System

**Color Palette:**
- `--olive` `#4a5c2a` — Main DTC bus green
- `--mustard-bright` `#e8b800` — Yellow accents, logo
- `--rust` `#b84c1a` — Worn metal, highlights
- `--beige` `#d4c4a0` — Aged cream, text
- `--dust` `#c8b890` — Dust particles, accents

**Fonts:**
- `Noto Sans Devanagari` — All Hindi text
- `Bebas Neue` — Logo and retro display text
- `Teko` — UI labels and badges

---

## 📱 PWA Installation

BusAdda is installable as a Progressive Web App:
1. Open in Chrome/Edge
2. Look for "Install" icon in the address bar
3. Install for a full-screen, offline-capable experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 Semantic |
| Styles | Vanilla CSS3, Custom Properties |
| Animations | CSS Keyframes, `will-change` |
| Logic | Vanilla JavaScript (ES6+) |
| Audio | Web Audio API |
| Music | YouTube IFrame API |
| PWA | Service Worker + Web App Manifest |
| Assets | AI-generated illustrations (Stable Diffusion) |

---

## ⚙️ Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full (Web Audio may need interaction) |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

---

## 🇮🇳 About DTC Buses

The Delhi Transport Corporation (DTC) was established in 1948 and ran the iconic green-and-yellow Leyland Atlantean and Tata buses through Delhi's streets for decades. By the 1990s, these buses were the lifeblood of Delhi — overcrowded, noisy, bumpy, and absolutely irreplaceable. 

Routes like 101, 181, 423, and 720 connected Old Delhi to South Delhi, ferrying millions daily. The conductor with his ticket punch, the driver's Hanuman ji on the dashboard, the peeling Bollywood posters — these are the textures of a city that was.

**Route 423: Old Delhi ↔ Saket** — *this one's for you.*

---

## 📄 License

MIT License — free to use, fork, and extend. Just give credit to the DTC buses of Delhi. 🙏

---

*ROUTE 423 | OLD DELHI → SAKET | बस अड्डा © 2024*
