class ResponsiveVideo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const src = this.getAttribute('src') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
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
          pointer-events: none;
        }
      </style>
      <div class="container">
        <video src="${src}" autoplay loop muted playsinline disablepictureinpicture></video>
      </div>
    `;
  }
}

customElements.define('responsive-video', ResponsiveVideo);