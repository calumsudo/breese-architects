class ImageCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 1; // Start at the second image (index 1)
    this._images = [];
  }

  static get observedAttributes() {
    return ['images'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'images' && oldValue !== newValue) {
      try {
        this._images = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Invalid JSON for images attribute', e);
      }
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    // Event delegation or binding can be done here if needed
    // But since we re-render, we might need to re-bind or use a stable container
    // For simplicity with full re-renders, we'll bind in render or use a persistent container
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  }

  nextImage() {
    if (this.currentIndex < this._images.length - 1) {
      this.currentIndex++;
      this.render();
    }
  }

  render() {
    if (!this._images || this._images.length === 0) return;

    // Calculate view window
    // We want to show 3 images: left, center, right
    // The "center" is the currentIndex.
    
    // We need to handle edge cases where currentIndex is 0 (no left) or last (no right)
    // The prompt says "only ever show 3 images at a time".
    // It also says "start position should be the second photo".
    // If we are at index 0, we might show [null, 0, 1] or stop at 0?
    // Let's assume the list is finite.
    // If index = 0, show empty/placeholder left, image 0 center, image 1 right.
    // If index = last, show image n-1 left, image n center, empty right.

    const styles = `
      :host {
        display: block;
        width: 100%;
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
        height: 500px; /* Fixed height to prevent jumping */
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

      /* Side images: Fill remaining space, Portrait Crop */
      .side-image {
        flex: 1; 
        min-width: 0; /* Allows flex shrink if needed */
      }

      .side-image img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Forces fill */
        filter: grayscale(100%);
        opacity: 0.8;
        display: block;
      }

      /* Center image: Sized by content (height) */
      .center-image {
        flex: 0 0 auto; /* Do not grow, just fit content */
        width: auto;
        max-width: 70%; /* Ensure side images are always visible */
      }

      .center-image img {
        height: 100%; /* Match container fixed height */
        width: auto; /* Width adjusts to maintain aspect ratio */
        object-fit: contain; /* Ensure full image is seen (Original Crop) */
        filter: grayscale(0%);
        opacity: 1;
        display: block;
      }

      /* Controls */
      .controls-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 30px;
        margin-top: 4px; /* Slight separation */
      }

      .arrow {
        cursor: pointer;
        width: 24px;
        height: 24px;
        fill: var(--arrow-color);
        display: flex;
        align-items: center;
        justify-content: center;
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
        border: 1px solid #fff;
        border-radius: 5px;
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
      }

      .scrollbar-thumb {
        height: 100%;
        background-color: var(--thumb-color);
        border: 1px solid #fff;
        border-radius: 5px;
        position: absolute;
        top: 0;
        transition: left 0.3s ease;
        box-sizing: border-box;
      }
    `;

    // Logic for visible images
    const prevIndex = this.currentIndex - 1;
    const nextIndex = this.currentIndex + 1;

    const getImageHTML = (index, type) => {
      if (index < 0 || index >= this._images.length) {
        return `<div class="image-slot ${type}" style="visibility: hidden;"></div>`;
      }
      return `
        <div class="image-slot ${type}">
          <img src="${this._images[index]}" alt="Image ${index}">
        </div>
      `;
    };

    // Calculate Scrollbar Position
    // We have N images. The thumb represents the current index.
    // Thumb width could be proportional (1/N) or fixed.
    // Let's make it proportional but with a min-width.
    const totalImages = this._images.length;
    const thumbWidthPercent = Math.max(10, 100 / totalImages); 
    // Left position range: 0% to (100% - thumbWidth)
    const maxLeft = 100 - thumbWidthPercent;
    // Current step:
    // If totalImages = 5, indices 0..4
    // Percent per step = maxLeft / (totalImages - 1)
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
          <!-- Left Arrow -->
          <div class="arrow arrow-left ${this.currentIndex === 0 ? 'disabled' : ''}" id="prevBtn">
            <svg viewBox="0 0 18 10" width="100%" height="100%">
               <path d="M17.4596,9.9108L0,4.9724,17.4596.5278v9.383Z" />
            </svg>
          </div>

          <!-- Scrollbar -->
          <div class="scrollbar-track" id="track">
            <div class="scrollbar-thumb" style="width: ${thumbWidthPercent}%; left: ${thumbLeft}%;"></div>
          </div>

          <!-- Right Arrow -->
          <div class="arrow arrow-right ${this.currentIndex === this._images.length - 1 ? 'disabled' : ''}" id="nextBtn">
            <svg viewBox="0 0 18 10" width="100%" height="100%">
              <path d="M0,9.9108l17.4596-4.9384-17.4596-4.4446v9.383Z" />
            </svg>
          </div>
        </div>

      </div>
    `;

    this.shadowRoot.getElementById('prevBtn').addEventListener('click', () => this.prevImage());
    this.shadowRoot.getElementById('nextBtn').addEventListener('click', () => this.nextImage());
    
    // Optional: Click on track to jump?
    // For now, adhere to spec: Arrows move it.
  }
}

customElements.define('image-carousel', ImageCarousel);
