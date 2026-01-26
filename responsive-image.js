class ResponsiveImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['src', 'alt'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';

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
        img {
          display: block;
          width: 100%;
          height: auto;
        }
      </style>
      <div class="container">
        <img src="${src}" alt="${alt}" />
      </div>
    `;
  }
}

customElements.define('responsive-image', ResponsiveImage);