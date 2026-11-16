# Product Requirements Document (PRD) & Technical Architecture

**Project:** Next-Generation Color Palette & Design Utilities Platform (Color-Mint)

**Target Audience:** Designers, Developers, Illustrators, and Digital Artists.

## 1. Brand Identity Concept

**Primary Brand Name:** **Color-Mint**

**Brand Mission:** To provide the most intuitive, lightning-fast, and comprehensive color utility platform that bridges the gap between raw inspiration and technical implementation—completely free and accessible to everyone instantly.

**Brand Vibe:** Modern, minimalist, ultra-fast, creative, and frictionless.

## 2. High-Level Technical Architecture

To achieve maximum speed and eliminate the need for user accounts, the app heavily relies on client-side atomic state, URL-based sharing (Base62 URL packing / Nuqs), and local device storage.

### Frontend (Client-Side)

* **Framework:** Next.js (App Router, React 19 / TypeScript)
* **Styling:** Tailwind CSS v4 + Framer Motion (for smooth micro-interactions, especially during the spacebar palette generation).
* **State Management:** Jotai (Atomic state management for fine-grained re-renders of color columns, lock states, shades, and harmonics) + Nuqs / Base62 URL packing (for zero-latency URL synchronization and ultra-compact shareable links).
* **Color Science & Math:** OKLCH color space (perceptually uniform lightness and chroma for natural harmonies, tint/shade ramps, and WCAG contrast calculations) via `culori` or native OKLCH algorithms.
* **Storage (No Auth):** LocalStorage / IndexedDB (to allow users to save "Favorite" palettes directly to browser without accounts).
* **Canvas/Graphics:** HTML5 Canvas API / Fabric.js (for collage export, image color extraction with eyedropper magnifier).

### Backend (Server-Side / API) & Persistence

* **API Layer:** Next.js App Router API handlers / Server Actions.
* **Database & ORM:** Drizzle ORM (lightweight, zero-overhead, type-safe SQL/PostgreSQL or SQLite/LibSQL) / MongoDB public discovery feed for community palettes, trending tags, and anonymous upvoting. Strictly no user authentication, session, or account tables.

## 3. Frontend Features Breakdown

### A. The Core Engine (Palette Generator)
* **Spacebar Generation:** Hit spacebar to generate random, aesthetically pleasing color palettes.
* **Dynamic Palette Size:** Users can generate palettes ranging from 2 up to 10 colors.
* **Locking Mechanism:** Click a lock icon on a specific color to keep it while generating new colors around it.
* **Color Adjustment:** Drag and drop to reorder colors (@hello-pangea/dnd or dnd-kit). Manually tweak Hue, Saturation/Chroma, Lightness (OKLCH, HSL, RGB, HEX, CMYK).
* **Shades & Tints:** Click a color to view an OKLCH perceptual grid of shades/tints and select one to replace current color.
* **Color Blindness Simulator:** Toggle view to simulate Protanopia, Deuteranopia, Tritanopia, and Achromatopsia using SVG filter matrices or perceptual transforms.
* **Export Options:** Export palette as URL, PDF, PNG, SVG, SCSS, CSS Variables, Tailwind v4 config snippet, Figma tokens, Adobe ACO/ASE, or copy HEX/OKLCH codes directly.

### B. Discovery & Exploration
* **Explore Palettes:** Masonry grid of curated and dynamically generated palettes for inspiration with filters (Trending, Latest, Popular) and search.
* **Gradient Explore & Maker:** Browse popular CSS gradients, visual OKLCH-interpolated gradient builder.
* **Color Dictionary/List:** Searchable directory of named colors with hex codes, psychological meanings, and complementary palettes.

### C. Utilities & Tools
* **Image Picker:** Upload image in-browser and extract 5–10 color palette with OKLCH k-means/median-cut clustering + pixel magnifier loupe.
* **Contrast Checker:** WCAG 2.1 / APCA compliance calculations between colors for foreground/background readability.
* **Palette Visualizer:** Apply palette to real-time mock UI (dashboard, landing page, mobile card).
* **Tailwind CSS v4 Integration:** Export CSS `@theme` / Tailwind configuration directly.

### D. Local Library (No Account Required)
* **Browser-Based Saving:** LocalStorage/IndexedDB library with tags and export capabilities.
* **URL Sharing:** Ultra-compact Base62 URL packing / Nuqs state sync for instant link sharing without database lookups.

## 4. Antigravity AI Agent Instructions (SDD)
* **Architecture Enforcement:** Strict adherence to Next.js App Router, Tailwind CSS v4, Jotai atomic state, OKLCH perceptual color math, and Base62 URL packing.
* **Backend Alignment:** Zero-auth public feed and storage using Drizzle ORM / lightweight database.
* **Component Modularity:** Independent draggable color columns with isolated atom subscriptions to prevent unnecessary full-palette re-renders.
* **Performance:** Sub-16ms (60-120fps) spacebar generation and color tweaking with pre-computed or vectorized OKLCH harmony calculations.
