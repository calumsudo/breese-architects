class ResponsiveVideo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.resizeObserver = null;
  }

  connectedCallback() {
    this.render();
    this.setupResizeObserver();
  }

  disconnectedCallback() {
    // Clean up observer when element is removed
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback() {
    this.render();
  }

  setupResizeObserver() {
    // Watch for size changes and fix parent heights accordingly
    this.resizeObserver = new ResizeObserver(() => {
      this.fixParentHeight();
    });

    // Observe the video element for size changes
    const video = this.shadowRoot.querySelector('video');
    if (video) {
      this.resizeObserver.observe(video);
    }

    // Initial fix
    this.fixParentHeight();
  }

  fixParentHeight() {
    requestAnimationFrame(() => {
      const video = this.shadowRoot.querySelector('video');
      if (!video) return;

      // Get the actual rendered height of the video
      const videoHeight = video.getBoundingClientRect().height;

      // Set host height to match video
      this.style.setProperty('height', `${videoHeight}px`, 'important');
      this.style.setProperty('max-height', `${videoHeight}px`, 'important');

      // Walk up the DOM and fix Wix wrapper heights and widths
      let parent = this.parentElement;
      let levels = 0;
      while (parent && levels < 5) {
        parent.style.setProperty('height', `${videoHeight}px`, 'important');
        parent.style.setProperty('max-height', `${videoHeight}px`, 'important');
        parent.style.setProperty('min-height', '0', 'important');
        // Ensure parents don't constrain width, preventing horizontal clipping
        parent.style.setProperty('width', '100%', 'important');
        parent.style.setProperty('max-width', '100%', 'important');
        parent.style.setProperty('overflow', 'visible', 'important');
        parent = parent.parentElement;
        levels++;
      }
    });
  }

  render() {
    const src = this.getAttribute('src') || 'https://video.wixstatic.com/video/865cb6_9b5c7f74d8694e529b380004fe83d78c/1080p/mp4/file.mp4';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          box-sizing: border-box;
          overflow: visible;
        }
        .container {
          width: 100%;
          padding-left: calc(100vw / 12);
          padding-right: calc(100vw / 12);
          box-sizing: border-box;
        }
        video {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          object-fit: contain;
          pointer-events: none;
        }

        @media (max-width: 1200px), (orientation: portrait) {
          .container {
            padding-left: 0;
            padding-right: 0;
            /* Clear the fixed top nav banner */
            margin-top: clamp(36px, 6vw, 56px);
          }
        }
      </style>
      <div class="container">
        <video src="${src}" autoplay loop muted playsinline disablepictureinpicture></video>
      </div>
    `;

    // Re-setup observer after re-render since DOM changed
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.setupResizeObserver();
    }
  }
}

customElements.define('responsive-video', ResponsiveVideo);