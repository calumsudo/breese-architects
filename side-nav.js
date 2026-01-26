class SideNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const active = this.getAttribute('active') || 'home';

    const links = [
      { id: 'home', label: 'HOME' },
      { id: 'portfolio', label: 'PORTFOLIO' },
      { id: 'about', label: 'ABOUT' },
      { id: 'contact', label: 'CONTACT' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: calc(100vw / 12);
          height: 100vh;
          position: relative;
          box-sizing: border-box;
        }

        .container {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;
        }

        .logo-wrapper {
          width: 100%;
          flex-shrink: 0;
        }

        .logo {
          display: block;
          width: 100%;
          height: auto;
          max-width: 100px;
        }

        .nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2rem;
        }

        .nav-link {
          font-family: inherit;
          font-size: 18px;
          font-weight: normal;
          margin: 0;
          letter-spacing: 0.1em;
          text-decoration: none;
          color: #1a2e35;
          cursor: pointer;
          transition: opacity 0.3s ease;
          opacity: 0.35;
        }

        .nav-link.active {
          opacity: 1;
        }

        .nav-link:hover {
          opacity: 1;
        }
      </style>

      <div class="container">
        <div class="logo-wrapper">
          <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="693.44 423.29 101.95 101.95">
            <rect x="694.5" y="423.29" width="99.83" height="101.95" fill="#14394f" stroke="#fff" stroke-width="0.29" stroke-miterlimit="10"/>
            <path fill="#8fc3e1" stroke="#8ccbeb" stroke-width="0.43" stroke-miterlimit="10" d="M731.67,486.26c-2.13,2.84-3.04,7.57.36,11.36,1.11,1.23,2.55,2.4,5.59,2.37h52.68c-.87-.56-1.66-1.1-2.66-1.85-1.53-1.15-3.21-2.46-4.32-3.42-9.17,0-16.91-.3-26.14-.42-4.35-.06-8.69,0-13.02,0,0,0-4.37,0-4.99-4.88-.22-1.71.76-5.12,6.42-6.5h26.87s-2.17-2.95-3.79-5.88h-27.61s-8.59,0-8.59,0c1.01,2,2.51,3.89,4.42,5.9,0,0-3.07.41-5.24,3.32Z"/>
            <path fill="#8fc3e1" stroke="#8ccbeb" stroke-width="0.43" stroke-miterlimit="10" d="M738.05,474.06c-.65-2.3-1.85-7.74,1.25-12.12,0,0,2.73-5.11,6.6-4.85l15.63.72s-1.01-3.84-1.24-9.35h-20.43s-2.96.24-3.86,1.24c0,0-6.01,6.05-6.22,15.24,0,0-.39,4.31,1.48,9.13l6.8-.02Z"/>
            <path fill="#fff" stroke="#8ccbeb" stroke-width="0.43" stroke-miterlimit="10" d="M757.48,474.31c1.87,4.81,1.48,9.25,1.48,9.25-.21,9.16-6.22,15.2-6.22,15.2-.9,1-3.86,1.24-3.86,1.24h-20.43c-.23-5.49-1.24-9.32-1.24-9.32l15.63.72c3.87.26,6.6-4.84,6.6-4.84,3.1-4.36,1.9-9.93,1.25-12.23l6.8-.02Z"/>
            <path fill="#fff" stroke="#8ccbeb" stroke-width="0.43" stroke-miterlimit="10" d="M757.06,462.24c2.13-2.85,3.04-7.59-.36-11.4-1.11-1.24-2.55-2.41-5.59-2.38h-52.68c.87.56,1.66,1.1,2.66,1.86,1.53,1.15,3.21,2.47,4.32,3.43,9.17,0,16.91.3,26.14.42,4.35.06,8.69,0,13.02,0,0,0,4.37,0,4.99,4.9.22,1.71-.76,5.14-6.42,6.52h-26.87s2.17,2.96,3.79,5.9h27.61s8.59,0,8.59,0c-1.01-2-2.51-3.9-4.42-5.91,0,0,3.07-.42,5.24-3.33Z"/>
          </svg>
        </div>
        <nav class="nav">
          ${links.map(link => `
            <h1 
              class="nav-link ${active === link.id ? 'active' : ''}" 
              data-anchor="${link.id}"
            >
              ${link.label}
            </h1>
          `).join('')}
        </nav>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const anchor = link.dataset.anchor;
        this.dispatchEvent(new CustomEvent('navclick', {
          detail: { anchor },
          bubbles: true,
          composed: true
        }));
      });
    });
  }
}

customElements.define('side-nav', SideNav);