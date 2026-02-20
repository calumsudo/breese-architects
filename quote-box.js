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

  // Transform comma path segments from normalised 100×150 space
  // into actual pixel coordinates.
  _transformComma(tx, ty, scaleX, scaleY) {
    // Comma / closing-quote in normalised 100 × 150 space.
    const pts = [
      ['M', 50, 0],
      ['C', 78, 0, 100, 22, 100, 50],
      ['C', 100, 78, 78, 100, 55, 100],
      ['C', 35, 115, 15, 135, 0, 150],
      ['C', 12, 135, 28, 115, 38, 100],
      ['C', 18, 96, 0, 78, 0, 50],
      ['C', 0, 22, 22, 0, 50, 0],
      ['Z']
    ];
    return pts.map(seg => {
      if (seg[0] === 'Z') return 'Z';
      const cmd = seg[0];
      const coords = [];
      for (let i = 1; i < seg.length; i += 2) {
        coords.push(tx + seg[i] * scaleX);
        coords.push(ty + seg[i + 1] * scaleY);
      }
      return cmd + coords.join(' ');
    }).join(' ');
  }

  updateSVG() {
    const container = this.shadowRoot.querySelector('.container');
    const svg = this.shadowRoot.querySelector('svg');
    if (!container || !svg) return;

    const hostRect = this.getBoundingClientRect();
    const h = hostRect.height;
    if (h === 0) return;

    container.style.height = h + 'px';

    const style = getComputedStyle(container);
    const w = container.clientWidth
      - parseFloat(style.paddingLeft)
      - parseFloat(style.paddingRight);
    if (w <= 0) return;

    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    // Quote mark dimensions — proportional to box height
    const markH = h * 0.4;
    const markW = markH * 0.65;
    const sx = markW / 100;
    const sy = markH / 150;

    // Opening quote (top-left): flip y so tail points toward top-left corner
    const openQuote = this._transformComma(0, markH, sx, -sy);
    // Closing quote (bottom-right): flip x so tail points toward bottom-right corner
    const closeQuote = this._transformComma(w, h - markH, -sx, sy);

    // Single path with evenodd: outer rectangle + inner quote shapes = cutouts
    const d = `M0 0H${w}V${h}H0Z ${openQuote} ${closeQuote}`;

    svg.innerHTML =
      `<path fill-rule="evenodd" fill="#002a3b" d="${d}"/>`;
  }
}

customElements.define('quote-box', QuoteBox);
