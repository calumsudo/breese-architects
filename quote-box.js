class QuoteBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['height'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const h = this.getAttribute('height') || '250';
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: ${parseInt(h, 10)}px;
          background-color: #002a3b;
        }
        .container {
          position: relative;
          width: 100%;
          height: 100%;
          padding-left: calc(100vw * 3 / 12);
          padding-right: calc(100vw * 3 / 12);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 1200px) {
          .container {
            padding-left: calc(100vw / 12);
            padding-right: calc(100vw / 12);
          }
        }
        svg {
          position: absolute;
          display: block;
          pointer-events: none;
          height: 38%;
          max-height: 125px;
          width: auto;
        }
        
        .quote-open {
          top: 0;
          left: calc(100vw * 2 / 12);
        }
        
        .quote-close {
          bottom: 0;
          right: calc(100vw * 2 / 12);
        }

        @media (max-width: 1200px) {
          .quote-open {
            left: calc(100vw * 0.5 / 12);
          }
          .quote-close {
            right: calc(100vw * 0.5 / 12);
          }
        }
      </style>
      <div class="container">
        <!-- Top-left quote -->
        <svg class="quote-open" xmlns="http://www.w3.org/2000/svg" viewBox="15 5 80 115">
          <path fill="#FCFCFC" d="
            M84.750565,3.319713 
            C76.747787,9.231403 68.238762,14.582113 60.887642,21.215927 
            C53.837212,27.578392 49.680309,36.073730 49.138477,45.895954 
            C48.556953,56.437729 53.032211,64.654114 62.108276,69.464447 
            C68.779785,73.000359 76.154137,75.637177 83.525017,77.309242 
            C91.260292,79.063957 94.602341,82.018066 96.037849,91.819565 
            C98.268394,107.049515 87.081909,119.569313 70.750793,120.953346 
            C44.974358,123.137863 22.384321,105.220535 16.956858,78.126030 
            C10.978330,48.280521 20.753508,24.108240 44.265671,4.349872 
            C44.416969,3.225881 44.143883,2.113117 43.544838,1.894821 
            C42.111534,1.372513 40.524796,1.271243 39.000000,1.000000 
            C55.687561,1.000000 72.375122,1.000000 89.348419,1.292390 
            C88.006287,2.163091 86.378426,2.741402 84.750565,3.319713 
            z"/>
        </svg>

        <slot></slot>

        <!-- Bottom-right quote -->
        <svg class="quote-close" xmlns="http://www.w3.org/2000/svg" viewBox="1321 206 84 118">
           <path fill="#FCFCFC" d="
            M1328.468628,327.000000 
            C1333.844238,323.304962 1340.201416,320.208954 1345.399536,315.759125 
            C1351.520630,310.519043 1357.669312,304.770782 1361.987671,298.070862 
            C1372.937378,281.082733 1367.438843,263.976959 1349.027344,255.721069 
            C1343.908447,253.425781 1338.384888,251.924377 1332.929077,250.515198 
            C1324.708008,248.391800 1320.970703,244.372406 1320.070068,235.848984 
            C1318.625000,222.172501 1327.280640,210.877060 1341.535278,207.837189 
            C1363.000000,203.259735 1385.415527,215.464264 1395.080322,236.990601 
            C1408.064453,265.910400 1400.383667,298.773682 1375.458252,320.851288 
            C1373.341064,322.726501 1371.121338,324.485809 1368.974609,326.649475 
            C1355.645752,327.000000 1342.291504,327.000000 1328.468628,327.000000 
            z"/>
        </svg>
      </div>
    `;
  }
}

customElements.define('quote-box', QuoteBox);
