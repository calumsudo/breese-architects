class PortfolioInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['heading', 'subheading', 'text', 'button-text', 'button-link'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const heading = this.getAttribute('heading') || '';
    const subheading = this.getAttribute('subheading') || '';
    const text = this.getAttribute('text') || '';
    const buttonText = this.getAttribute('button-text') || '';
    const buttonLink = this.getAttribute('button-link') || '#';

    // CSS Grid: 12 columns.
    // Margins are 1/12th on left (col 1) and right (col 12).
    // Content lives in center 6 columns: Cols 4, 5, 6, 7, 8, 9.
    // Grid lines: |1|2|3|4 (start)|5|6|7|8|9|10 (end)|11|12|
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: var(--font_0, 'Arial', sans-serif); /* Fallback font */
          color: #1a2e35;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          width: 100%;
          box-sizing: border-box;
          padding-top: 60px;
          padding-bottom: 60px;
        }

        .content-wrapper {
          grid-column: 4 / 10; /* spans columns 4, 5, 6, 7, 8, 9 */
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        h2 {
          font-size: 48px;
          font-weight: normal;
          margin: 0;
          line-height: 1.2;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        h3 {
          font-size: 18px;
          font-weight: normal;
          margin: 0;
          opacity: 0.7;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .divider {
           width: 50px;
           height: 1px;
           background-color: #1a2e35;
           margin: 10px 0;
        }

        p {
          font-size: 18px;
          line-height: 1.6;
          margin: 0;
        }

        .btn {
          display: inline-block;
          margin-top: 16px;
          text-decoration: none;
          color: #1a2e35;
          border: 1px solid #1a2e35;
          padding: 12px 24px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 14px;
          transition: all 0.3s ease;
          width: fit-content;
        }

        .btn:hover {
          background-color: #1a2e35;
          color: #ffffff;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            /* Tablet: maybe widen grid to 2-12 or 3-11? 
               Lets try sticking to design request but maybe a bit looser if needed.
               For now complying with strict request unless small screen.
            */
        }

        @media (max-width: 768px) {
          /* Mobile: Full width with padding matching 1/12 roughly or just standard padding */
          .content-wrapper {
            grid-column: 2 / 12;
          }
          
          h2 {
            font-size: 24px;
          }
        }
        
        @media (max-width: 480px) {
           .content-wrapper {
             grid-column: 1 / 13;
             padding-left: 20px;
             padding-right: 20px;
           }
        }

      </style>

      <div class="grid-container">
        <div class="content-wrapper">
          ${subheading ? `<h3>${subheading}</h3>` : ''}
          ${heading ? `<h2>${heading}</h2>` : ''}
          ${subheading || heading ? `<div class="divider"></div>` : ''}
          ${text ? `<p>${text}</p>` : ''}
          ${buttonText ? `<a href="${buttonLink}" class="btn" target="_blank">${buttonText}</a>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('portfolio-info', PortfolioInfo);
