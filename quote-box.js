class QuoteBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.resizeObserver = null;
  }

  connectedCallback() {
    this.render();
    this.resizeObserver = new ResizeObserver(() => this.updateSVG());
    this.resizeObserver.observe(this);
    this._resizeHandler = () => this.updateSVG();
    window.addEventListener('resize', this._resizeHandler);
    requestAnimationFrame(() => this.updateSVG());
  }

  disconnectedCallback() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this._resizeHandler);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        .container {
          width: 100%;
          padding-left: calc(100vw * 3 / 12);
          padding-right: calc(100vw * 3 / 12);
          box-sizing: border-box;
        }
        @media (max-width: 1200px) {
          .container {
            padding-left: calc(100vw / 12);
            padding-right: calc(100vw / 12);
          }
        }
        svg {
          display: block;
        }
      </style>
      <div class="container">
        <svg xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    `;
  }

  updateSVG() {
    const container = this.shadowRoot.querySelector('.container');
    const svg = this.shadowRoot.querySelector('svg');
    if (!container || !svg) return;

    // Read host dimensions — Wix sets these on the custom element wrapper.
    const hostRect = this.getBoundingClientRect();
    const h = hostRect.height;
    if (h === 0) return;

    // Force the container to the host's height so the SVG can fill it.
    container.style.height = h + 'px';

    // The content width is the container width minus CSS padding.
    const w = container.clientWidth
      - parseFloat(getComputedStyle(container).paddingLeft)
      - parseFloat(getComputedStyle(container).paddingRight);
    if (w <= 0) return;

    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    // Quote mark dimensions — proportional to box height
    const markH = h * 0.4;
    const markW = markH * 0.65;

    // Comma / closing-quote shape in a normalised 100 × 150 coordinate space.
    // Circle head occupies roughly y 0–100, tail tapers to (0, 150).
    const comma =
      'M 50 0 C 78 0 100 22 100 50 C 100 78 78 100 55 100' +
      ' C 35 115 15 135 0 150' +
      ' C 12 135 28 115 38 100' +
      ' C 18 96 0 78 0 50 C 0 22 22 0 50 0 Z';

    const sx = markW / 100;
    const sy = markH / 150;

    // Opening quote (top-left): flip vertically so tail points toward corner
    const openT = `translate(0,${markH}) scale(${sx},${-sy})`;
    // Closing quote (bottom-right): flip horizontally so tail points toward corner
    const closeT = `translate(${w},${h - markH}) scale(${-sx},${sy})`;

    svg.innerHTML =
      `<defs>` +
        `<mask id="qm">` +
          `<rect width="${w}" height="${h}" fill="white"/>` +
          `<g transform="${openT}"><path d="${comma}" fill="black"/></g>` +
          `<g transform="${closeT}"><path d="${comma}" fill="black"/></g>` +
        `</mask>` +
      `</defs>` +
      `<rect width="${w}" height="${h}" fill="#002a3b" mask="url(#qm)"/>`;
  }
}

customElements.define('quote-box', QuoteBox);
