class ResponsiveVideo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.fixParentHeight();
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback() {
    this.render();
  }

  fixParentHeight() {
    // Force parent containers to respect content height
    requestAnimationFrame(() => {
      this.style.height = 'fit-content';
      
      // Walk up the DOM and fix Wix wrapper heights
      let parent = this.parentElement;
      let levels = 0;
      while (parent && levels < 3) {
        parent.style.setProperty('height', 'auto', 'important');
        parent.style.setProperty('min-height', '0', 'important');
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
          height: fit-content !important;
          box-sizing: border-box;
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
          height: auto;
          aspect-ratio: 3011 / 1881;
          pointer-events: none;
        }
      </style>
      <div class="container">
        <video src="${src}" autoplay loop muted playsinline disablepictureinpicture></video>
      </div>
    `;

    // Re-fix heights after render
    this.fixParentHeight();
  }
}

customElements.define('responsive-video', ResponsiveVideo);