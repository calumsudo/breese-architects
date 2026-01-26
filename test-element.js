class TestElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        div {
          padding: 20px;
          background: red;
          color: white;
          font-size: 24px;
        }
      </style>
      <div>TEST ELEMENT LOADED SUCCESSFULLY!</div>
    `;
  }
}

customElements.define('test-element', TestElement);
