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
    let scale = 1;
    if (vw <= 768) scale = 0.8; // Tablet
    else if (vw <= 900) scale = 0.85; // Intermediate for 850px range
    else if (vw <= 1024) scale = 0.9; // Small laptop
    else if (vw <= 1650) scale = 1.0; // Base Design Spec (Extended to 1650 to fix overlap)
    else if (vw <= 1920) scale = 1.1; // Large
    else scale = 1.2; // Extra Large

    const isMobile = vw <= 768;

    const tagline = this.getAttribute('tagline') || 'A welcome new breese';
    const yearStart = this.getAttribute('year-start') || '2026';
    const yearEnd = this.getAttribute('year-end') || '2050';
    const servicesRaw = this.getAttribute('services') || 'RESIDENTIAL ARCHITECTURE|FINE AND GRAPHIC ARTS|BRANDED PRODUCT DESIGN|PHOTOGRAPHY';
    const stat1Number = this.getAttribute('stat1-number') || '30';
    const stat1Text = this.getAttribute('stat1-text') || 'YEAR ANNIVERSARY BRICK AND MORTAR ON MARTHA\'S VINEYARD; NEW YORK AND MASSACHUSETTS LICENSES';
    const stat2Number = this.getAttribute('stat2-number') || '120';
    const stat2Text = this.getAttribute('stat2-text') || 'LUXURY RESIDENCES RENOVATED, ENLARGED OR BUILT ALL NEW';

    const services = servicesRaw.split('|').join('<br>');

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

        /* Mobile specific layout */
        @media (max-width: 768px) {
          .grid-wrapper {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto;
          }
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
          border-right: 4px solid var(--primary-color);
        }

        /* Q2: Top Right - Services */
        .q2 {
          background-color: transparent;
          color: var(--primary-color);
        }

        /* Q3: Bottom Left - Stat 1 */
        .q3 {
          background-color: var(--primary-color);
          color: var(--text-light);
          border-right: 4px solid var(--text-light);
        }

        /* Q4: Bottom Right - Stat 2 */
        .q4 {
          background-color: var(--primary-color);
          color: var(--text-light);
        }

        /* Mobile Adjustments for Borders */
        @media (max-width: 768px) {
          .q1 { border-right: none; border-bottom: 2px solid var(--primary-color); }
          .q2 { border-bottom: none; }
          .q3 { border-right: none; border-bottom: 2px solid var(--primary-color); }
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
          gap: ${Math.round(16 * scale)}px;
          font-size: ${Math.round(64 * scale)}px;
          letter-spacing: 0.05em;
        }

        .services {
          font-size: ${Math.round(24 * scale)}px; /* 24pt (px) base */
          line-height: 1.5;
          letter-spacing: 0.1em;
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