class ImageCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 1;
    this._images = [];
    this._preloaded = false;
  }

  static get observedAttributes() {
    return ['images'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'images' && oldValue !== newValue) {
      try {
        this._images = JSON.parse(newValue);
        this.preloadImages();
        this.render();
      } catch (e) {
        console.error('Invalid JSON for images attribute', e);
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  preloadImages() {
    if (this._preloaded) return;
    this._preloaded = true;
    
    this._images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  prevImage() {
    const len = this._images.length;
    this.currentIndex = (this.currentIndex - 1 + len) % len;
    this.render();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this._images.length;
    this.render();
  }

  render() {
    if (!this._images || this._images.length === 0) return;

    const styles = `
      :host {
        display: block;
        width: 100%;
        height: fit-content !important;
        font-family: sans-serif;
        --arrow-color: #002a3b;
        --track-color: #92928d;
        --thumb-color: #002a3b;
      }

      .carousel-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        position: relative;
        padding-left: calc(100vw / 12);
        padding-right: calc(100vw / 12);
        box-sizing: border-box;
      }

      .images-wrapper {
        display: flex;
        justify-content: center;
        align-items: stretch;
        width: 100%;
        height: clamp(300px, 40vw, 500px); /* Responsive height */
        gap: 4px;
        margin-bottom: 8px;
        overflow: hidden;
      }

      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .side-image {
        flex: 1; 
        min-width: 0;
      }

      .side-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
        opacity: 0.8;
        display: block;
      }

      .center-image {
        flex: 0 0 auto;
        width: auto;
        max-width: 70%;
        overflow: visible;
      }

      .center-image img {
        height: 100%;
        width: auto;
        max-width: 100%;
        object-fit: contain;
        filter: grayscale(0%);
        opacity: 1;
        display: block;
      }

      .controls-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        margin-top: 4px;
      }

      .arrow {
        cursor: pointer;
        width: 32px;
        height: 32px;
        fill: var(--arrow-color);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s ease;
      }

      .arrow:hover {
        opacity: 0.7;
      }

      .arrow.disabled {
        opacity: 0.3;
        cursor: default;
        pointer-events: none;
      }

      .scrollbar-track {
        flex-grow: 1;
        margin: 0 4px;
        height: 10px;
        background-color: var(--track-color);
        border-radius: 5px;
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
      }

      .scrollbar-thumb {
        height: 100%;
        background-color: var(--thumb-color);
        border: none;
        border-radius: 5px;
        position: absolute;
        top: 0;
        transition: left 0.3s ease;
        box-sizing: border-box;
      }

      @media (max-width: 1200px), (orientation: portrait) {
        .carousel-container {
          padding-left: 0;
          padding-right: 0;
        }

        .images-wrapper {
          height: auto;
        }

        .side-image {
          display: none;
        }

        .center-image {
          max-width: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .center-image img {
          width: auto;
          max-width: 100%;
          height: auto;
          max-height: 56vw;
          object-fit: contain;
        }
      }
    `;

    const len = this._images.length;
    const prevIndex = (this.currentIndex - 1 + len) % len;
    const nextIndex = (this.currentIndex + 1) % len;

    const getImageHTML = (index, type) => {
      return `
        <div class="image-slot ${type}">
          <img src="${this._images[index]}" alt="Image ${index}">
        </div>
      `;
    };

    const totalImages = this._images.length;
    const thumbWidthPercent = Math.max(10, 100 / totalImages); 
    const maxLeft = 100 - thumbWidthPercent;
    const stepPercent = totalImages > 1 ? maxLeft / (totalImages - 1) : 0;
    const thumbLeft = stepPercent * this.currentIndex;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="carousel-container">
        
        <div class="images-wrapper">
          ${getImageHTML(prevIndex, 'side-image')}
          ${getImageHTML(this.currentIndex, 'center-image')}
          ${getImageHTML(nextIndex, 'side-image')}
        </div>

        <div class="controls-container">
          <div class="arrow arrow-left" id="prevBtn">
            <svg viewBox="0 0 18 10" width="100%" height="100%">
               <path d="M0,5 L17,0 A15,15 0 0,0 17,10 Z" />
            </svg>
          </div>

          <div class="scrollbar-track" id="track">
            <div class="scrollbar-thumb" style="width: ${thumbWidthPercent}%; left: ${thumbLeft}%;"></div>
          </div>

          <div class="arrow arrow-right" id="nextBtn">
            <svg viewBox="0 0 18 10" width="100%" height="100%">
              <path d="M18,5 L1,10 A15,15 0 0,0 1,0 Z" />
            </svg>
          </div>
        </div>

      </div>
    `;

    this.shadowRoot.getElementById('prevBtn').addEventListener('click', () => this.prevImage());
    this.shadowRoot.getElementById('nextBtn').addEventListener('click', () => this.nextImage());

    // --- Scrollbar interaction (click + drag) ---
    const track = this.shadowRoot.getElementById('track');
    const thumb = track.querySelector('.scrollbar-thumb');

    const indexFromPosition = (clientX) => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (this._images.length - 1));
    };

    // Click on track to jump to image
    track.addEventListener('click', (e) => {
      if (this._dragged) return; // ignore click after drag
      const newIndex = indexFromPosition(e.clientX);
      if (newIndex !== this.currentIndex) {
        this.currentIndex = newIndex;
        this.render();
      }
    });

    // Drag support
    const onDragStart = (startX) => {
      this._dragged = false;
      thumb.style.transition = 'none';

      const onDragMove = (clientX) => {
        this._dragged = true;
        const newIndex = indexFromPosition(clientX);
        if (newIndex !== this.currentIndex) {
          this.currentIndex = newIndex;
          // Update thumb position without full re-render
          const mLeft = 100 - thumbWidthPercent;
          const sStep = this._images.length > 1 ? mLeft / (this._images.length - 1) : 0;
          thumb.style.left = (sStep * this.currentIndex) + '%';
        }
      };

      const onDragEnd = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        // Re-render to sync images with final position
        this.render();
      };

      const onMouseMove = (e) => onDragMove(e.clientX);
      const onMouseUp = () => onDragEnd();
      const onTouchMove = (e) => onDragMove(e.touches[0].clientX);
      const onTouchEnd = () => onDragEnd();

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd);
    };

    thumb.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onDragStart(e.clientX);
    });

    thumb.addEventListener('touchstart', (e) => {
      onDragStart(e.touches[0].clientX);
    }, { passive: true });
  }
}

customElements.define('image-carousel', ImageCarousel);