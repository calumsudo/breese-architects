customElements.define('portfolio-header', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'tagline',
      'year-start',
      'year-end',
      'services',
      'stat1-number',
      'stat1-text',
      'stat2-number',
      'stat2-text'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this._resizeHandler = () => this.render();
    window.addEventListener('resize', this._resizeHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._resizeHandler);
  }

  render() {
    const vw = window.innerWidth;
    
    // Scale factors to match portfolio-info.js logic (1440px is base 1.0)
    let scale;
    if (vw >= 1920) scale = 1.2;           // Extra Large
    else if (vw >= 1650) scale = 1.1;      // Large
    else if (vw >= 1440) scale = 1.0;      // Base Design Spec
    else scale = Math.max(vw / 1440, 0.4); // Proportional shrink, floor at 0.4

    const tagline = this.getAttribute('tagline') || 'A welcome new breese';
    const yearStart = this.getAttribute('year-start') || '2026';
    const yearEnd = this.getAttribute('year-end') || '2050';
    const servicesRaw = this.getAttribute('services') || 'RESIDENTIAL ARCHITECTURE|FINE AND GRAPHIC ARTS|BRANDED PRODUCT DESIGN|PHOTOGRAPHY';
    const stat1Number = this.getAttribute('stat1-number') || '30';
    const stat1Text = this.getAttribute('stat1-text') || 'YEAR ANNIVERSARY BRICK AND MORTAR ON MARTHA\'S VINEYARD; NEW YORK AND MASSACHUSETTS LICENSES';
    const stat2Number = this.getAttribute('stat2-number') || '120';
    const stat2Text = this.getAttribute('stat2-text') || 'LUXURY RESIDENCES RENOVATED, ENLARGED OR BUILT ALL NEW';

    const services = servicesRaw.split('|').join('<br>');

    // Compute max services font size so the longest line fits in Q2 without wrapping
    const containerPad = vw >= 1550 ? vw * 3 / 12 : vw / 12;
    const quadPad = Math.round(24 * scale);
    const borderW = Math.max(Math.round(4 * scale), 1);
    const q2Width = (vw - 2 * containerPad) / 2 - 2 * quadPad - borderW;
    const longestLine = servicesRaw.split('|').reduce((a, b) => a.length > b.length ? a : b, '');
    // ~0.62em per uppercase char in Afacad at letter-spacing 0
    const maxServiceFont = Math.floor(q2Width / (longestLine.length * 0.62));
    const servicesFontSize = Math.min(Math.round(24 * scale), maxServiceFont);

    this.shadowRoot.innerHTML = `
      <style>
        @font-face {
          font-family: 'Afacad';
          src: url('https://cdn.jsdelivr.net/gh/calumsudo/breese-architects@main/assets/Afacad-VariableFont_wght.ttf') format('truetype');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

        :host {
          display: block;
          width: 100%;
          font-family: 'Afacad', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --primary-color: #002a3b;
          --text-light: #ffffff;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .container {
          width: 100%;
          padding-left: calc(100vw / 12);
          padding-right: calc(100vw / 12);
        }

        @media (min-width: 1550px) {
          .container {
            padding-left: calc(100vw * 3 / 12);
            padding-right: calc(100vw * 3 / 12);
          }
        }

        .grid-wrapper {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-rows: auto auto;
          width: 100%;
        }


        .quad {
          padding: ${Math.round(24 * scale)}px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 100%;
        }

        /* Q1: Top Left - Tagline & Years */
        .q1 {
          background-color: transparent;
          color: var(--primary-color);
          align-items: flex-start;
          border-right: ${Math.max(Math.round(4 * scale), 1)}px solid var(--primary-color);
        }

        /* Q2: Top Right - Services */
        .q2 {
          background-color: transparent;
          color: var(--primary-color);
          overflow: hidden;
        }

        /* Q3: Bottom Left - Stat 1 */
        .q3 {
          background-color: var(--primary-color);
          color: var(--text-light);
          border-right: ${Math.max(Math.round(4 * scale), 1)}px solid var(--text-light);
        }

        /* Q4: Bottom Right - Stat 2 */
        .q4 {
          background-color: var(--primary-color);
          color: var(--text-light);
        }


        /* Typography */
        .tagline {
          font-size: ${Math.round(30 * scale)}px; /* 30pt (px) base */
          font-weight: 400;
          margin-bottom: ${Math.round(20 * scale)}px;
          line-height: 1.2;
        }

        .years {
          display: flex;
          gap: ${Math.round(12 * scale)}px;
          font-size: ${Math.round(64 * scale)}px;
          letter-spacing: ${scale >= 1 ? '0.05em' : '0em'};
        }

        .services {
          font-size: ${servicesFontSize}px; /* 24pt (px) base, clamped to fit Q2 */
          line-height: 1.5;
          letter-spacing: ${scale >= 1 ? '0.1em' : '0em'};
          text-transform: uppercase;
          white-space: nowrap;
        }

        .stat-number {
          font-size: ${Math.round(64 * scale)}px; /* 64pt (px) base */
          line-height: 1;
          margin-bottom: ${Math.round(16 * scale)}px;
        }

        .stat-text {
          font-size: ${Math.round(15 * scale)}px; /* 15pt (px) base */
          text-transform: uppercase;
          line-height: 1.5;
          letter-spacing: 0.05em;
          max-width: 90%;
        }

      </style>

      <div class="container">
        <div class="grid-wrapper">
          
          <!-- Q1 -->
          <div class="quad q1">
            <div class="tagline">${tagline}</div>
            <div class="years">
              <span>${yearStart}</span>
              <span>${yearEnd}</span>
            </div>
          </div>

          <!-- Q2 -->
          <div class="quad q2">
            <div class="services">${services}</div>
          </div>

          <!-- Q3 -->
          <div class="quad q3">
            <div class="stat-number">${stat1Number}</div>
            <div class="stat-text">${stat1Text}</div>
          </div>

          <!-- Q4 -->
          <div class="quad q4">
            <div class="stat-number">${stat2Number}</div>
            <div class="stat-text">${stat2Text}</div>
          </div>

        </div>
      </div>
    `;
  }
});