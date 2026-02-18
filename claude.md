# Breese Architects - Project Documentation

## Project Overview

This is a Wix website with custom components hosted on GitHub Pages and embedded into the Wix site.

## Critical: Margin System

**The margins are the most important part of this website.** They are defined in the `responsive-video.js` file and must be preserved across all modifications.

### Margin Definition

The margin system uses a 12-column grid with gutters on both sides:

```css
padding-left: calc(100vw / 12);
padding-right: calc(100vw / 12);
```

This creates a consistent **8.33% margin** on each side of the content (1/12th of viewport width).

Location: `responsive-video.js:82-83`

### Why These Margins Matter

- Provides consistent visual rhythm across the entire site
- Ensures proper alignment with Wix's layout system
- Creates appropriate breathing room for content
- Maintains design integrity across all viewport sizes

## Architecture

### Hosting Setup
- Custom components are hosted on **GitHub Pages**
- Components are embedded into the Wix site via iframe or script tags
- This approach allows for custom JavaScript/HTML that Wix doesn't natively support

### Key Files

#### responsive-video.js
A custom Web Component (`<responsive-video>`) that handles video display with:
- Automatic aspect ratio maintenance (3011:1881)
- Parent height fixing for Wix's wrapper elements
- ResizeObserver for responsive behavior
- The critical margin system (padding-left/right)

## Development Guidelines

1. **Never modify the margin calculations** without explicit approval
2. When adding new components, maintain the same margin system
3. Test all changes in the Wix embedded context
4. Remember that these files are served from GitHub Pages, so changes need to be committed and pushed to take effect

## Recent Work

- Mobile navigation transformed into fixed horizontal top banner
- Side navigation overflow and sizing fixes
- Sidebar spacing adjustments
