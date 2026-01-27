class PortfolioInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return [
      'pre-title', 
      'title', 
      'description', 
      'stat-1-number', 
      'stat-1-label', 
      'stat-2-number', 
      'stat-2-label'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const preTitle = this.getAttribute('pre-title') || '';
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    
    const stat1Num = this.getAttribute('stat-1-number') || '';
    const stat1Label = this.getAttribute('stat-1-label') || '';
    
    const stat2Num = this.getAttribute('stat-2-number') || '';
    const stat2Label = this.getAttribute('stat-2-label') || '';

    this.shadowRoot.innerHTML = `
      <style>
        @font-face {
          font-family: 'Afacad';
          src: url('https://calumsudo.github.io/breese-architects/assets/Afacad-VariableFont_wght.ttf') format('truetype');
          font-weight: 100 900;
          font-style: normal;
        }

        :host {
          display: block;
          width: 100%;
          font-family: 'Afacad', sans-serif;
          color: #1a2e35;
          box-sizing: border-box;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          width: 100%;
          box-sizing: border-box;
          padding-top: 60px;
          padding-bottom: 60px;
        }

        /* 
          Main Content Wrapper: spans grid cols 4-9 (6 columns total).
          Inside this wrapper, we create a 2x2 grid.
        */
        .content-wrapper {
          grid-column: 4 / 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
        }

        /* --- Quadrants --- */
        
        .quad {
          padding: 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Top Left */
        .q1 {
          /* No borders, just white bg relative to container */
          align-items: flex-start;
          padding-left: 0;
        }

        /* Top Right */
        .q2 {
          border-left: 1px solid #1a2e35; /* Vertical Divider */
          padding-right: 0;
        }

        /* Bottom Row */
        .q3, .q4 {
          background-color: #14394f; /* Dark Blue from logo/image */
          color: #ffffff;
          min-height: 180px; /* Force some height for visual weight */
        }
        
        .q3 {
           border-right: 1px solid rgba(255,255,255,0.2); 
        }

        /* --- Typography Defaults (Mobile First / Default Fallback at small sizes) --- */
        /* Using ratio ~0.77 from base 1440px */

        .pre-title {
          font-size: 23px;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .title {
          font-size: 49px;
          font-weight: normal;
          margin: 0;
          line-height: 1;
          letter-spacing: 0.02em;
        }

        .description {
          font-size: 19px;
          line-height: 1.4;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-number {
          font-size: 49px; 
          font-weight: normal;
          line-height: 1;
          margin-bottom: 12px;
        }
        
        .stat-number.large {
           font-size: 60px;
        }

        .stat-label {
          font-size: 12px;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          max-width: 200px;
        }

        /* --- Breakpoints to match side-nav.js --- */

        /* Tablet (768px) - Ratio 0.88 */
        @media (min-width: 768px) {
           .pre-title { font-size: 26px; }
           .title { font-size: 56px; }
           .description { font-size: 21px; }
           .stat-number { font-size: 56px; }
           .stat-number.large { font-size: 70px; }
           .stat-label { font-size: 13px; }
        }

        /* Small Desktop (1024px) - Ratio 0.94 */
        @media (min-width: 1024px) {
           .pre-title { font-size: 28px; }
           .title { font-size: 60px; }
           .description { font-size: 22.5px; }
           .stat-number { font-size: 60px; }
           .stat-number.large { font-size: 75px; }
           .stat-label { font-size: 14px; }
        }

        /* Desktop Base (1440px) - Ratio 1.0 (The Design Spec) */
        @media (min-width: 1440px) {
           .pre-title { font-size: 30px; }
           .title { font-size: 64px; }
           .description { font-size: 24px; }
           .stat-number { font-size: 64px; }
           .stat-number.large { font-size: 80px; }
           .stat-label { font-size: 15px; }
        }
        
        /* Large Desktop (1920px) - Ratio 1.11 */
        @media (min-width: 1920px) {
           .pre-title { font-size: 33px; }
           .title { font-size: 71px; }
           .description { font-size: 26.5px; }
           .stat-number { font-size: 71px; }
           .stat-number.large { font-size: 89px; }
           .stat-label { font-size: 16.5px; }
        }

        /* Extra Large (2560px) - Ratio 1.22 */
        @media (min-width: 2560px) {
           .pre-title { font-size: 36.5px; }
           .title { font-size: 78px; }
           .description { font-size: 29px; }
           .stat-number { font-size: 78px; }
           .stat-number.large { font-size: 98px; }
           .stat-label { font-size: 18px; }
        }

        /* --- Layout Responsiveness (Mobile layout changes) --- */
        
        @media (max-width: 1024px) {
           /* Widen the main container on smaller screens so content isn't too squished */
           .content-wrapper {
             grid-column: 2 / 12;
           }
        }

        @media (max-width: 768px) {
          /* Stack the quadrants on mobile */
          .content-wrapper {
            grid-template-columns: 1fr;
            grid-column: 2 / 12;
          }
          
          .q2 {
            border-left: none;
            border-top: 1px solid #1a2e35;
            padding-left: 0;
            padding-top: 24px;
          }
          
          .q3, .q4 {
             border-right: none;
             border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .q4 {
            border-bottom: none;
          }
        }
        
        @media (max-width: 480px) {
           .content-wrapper {
             grid-column: 1 / 13;
             padding: 0 20px;
           }
           .q1, .q2, .q3, .q4 {
             padding: 24px 10px;
           }
        }

      </style>

      <div class="grid-container">
        <div class="content-wrapper">
          
          <!-- Q1: Title Section -->
          <div class="quad q1">
            <div class="pre-title">${preTitle}</div>
            <div class="title">${title}</div>
          </div>

          <!-- Q2: Description Section -->
          <div class="quad q2">
            <div class="description">${description}</div>
          </div>

          <!-- Q3: Stat 1 -->
          <div class="quad q3">
            <div class="stat-number">${stat1Num}</div>
            <div class="stat-label">${stat1Label}</div>
          </div>

          <!-- Q4: Stat 2 -->
          <div class="quad q4">
            <div class="stat-number large">${stat2Num}</div>
            <div class="stat-label">${stat2Label}</div>
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define('portfolio-info', PortfolioInfo);
