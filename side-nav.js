class SideNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['active', 'logo-src'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const active = this.getAttribute('active') || 'home';
    const logoSrc = this.getAttribute('logo-src') || '';

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

        .logo {
          width: 100%;
          aspect-ratio: 1;
          object-fit: contain;
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
        <img class="logo" src="${logoSrc}" alt="Logo" />
        <nav class="nav">
          ${links.map(link => `
            <a 
              class="nav-link ${active === link.id ? 'active' : ''}" 
              data-anchor="${link.id}"
            >
              ${link.label}
            </a>
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