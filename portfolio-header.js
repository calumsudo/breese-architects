class PortfolioHeader extends HTMLElement {
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
    
    // Determine breakpoint for font scaling
    let scale = 1;
    if (vw <= 768) scale = 0.5;
    else if (vw <= 1024) scale = 0.65;
    else if (vw <= 1440) scale = 0.8;
    else if (vw <= 1920) scale = 0.9;
    else if (vw <= 2560) scale = 0.95;
    
    const isMobile = vw <= 768;

    // Get attributes with defaults
    const tagline = this.getAttribute('tagline') || 'A welcome new breese';
    const yearStart = this.getAttribute('year-start') || '2026';
    const yearEnd = this.getAttribute('year-end') || '2050';
    const servicesRaw = this.getAttribute('services') || 'RESIDENTIAL ARCHITECTURE|FINE AND GRAPHIC ARTS|BRANDED PRODUCT DESIGN|PHOTOGRAPHY';
    const stat1Number = this.getAttribute('stat1-number') || '30';
    const stat1Text = this.getAttribute('stat1-text') || 'YEAR ANNIVERSARY BRICK AND MORTAR ON MARTHA\'S VINEYARD; NEW YORK AND MASSACHUSETTS LICENSES';
    const stat2Number = this.getAttribute('stat2-number') || '120';
    const stat2Text = this.getAttribute('stat2-text') || 'LUXURY RESIDENCES RENOVATED, ENLARGED OR BUILT ALL NEW';

    // Convert pipe-separated services to line breaks
    const services = servicesRaw.split('|').join('<br>');

    this.shadowRoot.innerHTML = `
      <style>
        @font-face {
          font-family: 'Afacad';
          src: url('https://raw.githubusercontent.com/calumsudo/breese-architects/main/assets/Afacad-VariableFont_wght.ttf') format('truetype');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

        :host {
          display: block;
          width: 100%;
          font-family: 'Afacad', 'Tenor Sans', 'Times New Roman', serif;
          --primary-color: #002a3b;
          --box-bg: #002a3b;
          --box-text: #ffffff;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          padding-left: ${vw >= 1440 ? 'calc(100vw * 3 / 12)' : 'calc(100vw / 12)'};
          padding-right: ${vw >= 1440 ? 'calc(100vw * 3 / 12)' : 'calc(100vw / 12)'};
          box-sizing: border-box;
          position: relative;
        }

        /* Centered divider that spans full height */
        .divider {
          display: ${isMobile ? 'none' : 'block'};
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--primary-color);
          transform: translateX(-50%);
        }

        /* Top section with tagline, years, and services */
        .top-section {
          display: ${isMobile ? 'block' : 'flex'};
          width: 100%;
          min-height: ${isMobile ? 'auto' : '140px'};
          position: relative;
        }

        .left-column {
          ${isMobile ? 'width: 100%;' : 'width: calc(50% - 20px);'}
          display: flex;
          flex-direction: column;
          justify-content: center;
          ${isMobile ? '' : 'padding-right: 40px;'}
        }

        .tagline {
          font-size: ${Math.round(44 * scale)}px;
          font-style: italic;
          color: var(--primary-color);
          margin-bottom: ${Math.round(12 * scale)}px;
          font-weight: 400;
          line-height: 1.2;
        }

        .years {
          display: flex;
          gap: ${Math.round(40 * scale)}px;
          align-items: baseline;
        }

        .year {
          font-size: ${Math.round(62 * scale)}px;
          color: var(--primary-color);
          letter-spacing: 0.15em;
          font-weight: 400;
          line-height: 1.1;
        }

        .right-column {
          ${isMobile ? 'width: 100%;' : 'width: calc(50% - 20px);'}
          display: flex;
          align-items: center;
          ${isMobile ? 'margin-top: 24px;' : 'margin-left: auto; padding-left: 40px;'}
        }

        .services {
          font-size: ${Math.round(18 * scale)}px;
          color: var(--primary-color);
          letter-spacing: 0.25em;
          line-height: 1.8;
          font-weight: 400;
        }

        /* Stats boxes section */
        .stats-section {
          display: ${isMobile ? 'block' : 'flex'};
          gap: 4px;
          width: 100%;
          margin-top: 16px;
        }

        .stat-box {
          flex: 1;
          background-color: var(--box-bg);
          color: var(--box-text);
          padding: ${Math.round(32 * scale)}px ${Math.round(40 * scale)}px;
          box-sizing: border-box;
          ${isMobile ? 'margin-bottom: 4px;' : ''}
        }

        .stat-number {
          font-size: ${Math.round(62 * scale)}px;
          font-weight: 400;
          display: block;
          margin-bottom: ${Math.round(12 * scale)}px;
          line-height: 1.1;
        }

        .stat-text {
          font-size: ${Math.round(14 * scale)}px;
          letter-spacing: 0.05em;
          line-height: 1.6;
          font-weight: 400;
          text-transform: uppercase;
        }
      </style>

      <div class="container">
        <!-- Centered divider spanning full height -->
        <div class="divider"></div>

        <div class="top-section">
          <div class="left-column">
            <div class="tagline">${tagline}</div>
            <div class="years">
              <span class="year">${yearStart}</span>
              <span class="year">${yearEnd}</span>
            </div>
          </div>

          <div class="right-column">
            <div class="services">${services}</div>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat-box">
            <div class="stat-number">${stat1Number}</div>
            <div class="stat-text">${stat1Text}</div>
          </div>

          <div class="stat-box">
            <div class="stat-number">${stat2Number}</div>
            <div class="stat-text">${stat2Text}</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('portfolio-header', PortfolioHeader);