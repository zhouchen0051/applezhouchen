// Product Detail Page - Dynamic Data Loading

class ProductDetailManager {
    constructor() {
        this.productId = null;
        this.product = null;
        this.detailContainer = document.getElementById('productDetail');
        
        this.init();
    }

    async init() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.productId = parseInt(urlParams.get('id'));
        
        if (!this.productId) {
            this.showError('未找到产品ID');
            return;
        }

        // Load product data
        const products = await fetchProducts();
        this.product = products.find(p => p.id === this.productId);
        
        if (!this.product) {
            this.showError('产品未找到');
            return;
        }

        this.renderProduct();
    }

    renderProduct() {
        if (!this.detailContainer || !this.product) return;

        const specs = this.product.specs || {};
        const specsList = Object.entries(specs)
            .map(([key, value]) => {
                const label = this.getSpecLabel(key);
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                return `
                    <li>
                        <span class="spec-label">${label}:</span>
                        <span>${displayValue}</span>
                    </li>
                `;
            })
            .join('');

        // Gallery HTML
        const gallery = this.product.gallery && this.product.gallery.length > 0
            ? `
                <div class="product-gallery">
                    <h3>更多图片</h3>
                    <div class="gallery-grid">
                        ${this.product.gallery.map((img, index) => `
                            <div class="gallery-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <img src="${img}" alt="${this.product.name} - 图片 ${index + 1}" 
                                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23f5f5f7\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'14\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E图片%3C/text%3E%3C/svg%3E'">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
            : '';

        this.detailContainer.innerHTML = `
            <div class="product-detail-main">
                <div class="product-detail-image-section">
                    <div class="product-detail-image-wrapper">
                        <img src="${this.product.image}" 
                             alt="${this.product.name}" 
                             class="product-detail-image"
                             id="mainProductImage"
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'%3E%3Crect fill=\\'%23f5f5f7\\' width=\\'400\\' height=\\'400\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E产品图片%3C/text%3E%3C/svg%3E'">
                    </div>
                    ${gallery}
                </div>
                <div class="detail-info">
                    <span class="detail-category">${this.product.category}</span>
                    <h1>${this.product.name}</h1>
                    <div class="detail-price">${this.product.price}</div>
                    <p class="detail-description">${this.product.description}</p>
                    ${specsList ? `
                        <div class="specs-section">
                            <h3>技术规格</h3>
                            <ul class="specs-list">
                                ${specsList}
                            </ul>
                        </div>
                    ` : ''}
                    <a href="products.html" class="btn btn-primary" style="margin-top: 2rem;">
                        查看所有产品
                    </a>
                </div>
            </div>
        `;

        // Initialize gallery interaction
        if (this.product.gallery && this.product.gallery.length > 0) {
            this.initGallery();
        }

        // Add fade-in animation
        this.detailContainer.style.opacity = '0';
        setTimeout(() => {
            this.detailContainer.style.transition = 'opacity 0.5s ease';
            this.detailContainer.style.opacity = '1';
        }, 50);
    }

    initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const mainImage = document.getElementById('mainProductImage');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                galleryItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                // Update main image
                if (mainImage) {
                    const imgSrc = item.querySelector('img').src;
                    mainImage.src = imgSrc;
                    // Add fade effect
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.style.opacity = '1';
                    }, 150);
                }
            });
        });
    }

    getSpecLabel(key) {
        const labels = {
            display: '显示屏',
            chip: '芯片',
            camera: '摄像头',
            storage: '存储容量',
            memory: '内存',
            battery: '电池续航',
            colors: '颜色',
            audio: '音频',
            charging: '充电',
            features: '特色功能'
        };
        return labels[key] || key;
    }

    showError(message) {
        if (this.detailContainer) {
            this.detailContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h2 style="color: #ff3b30; margin-bottom: 1rem;">错误</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">${message}</p>
                    <a href="products.html" class="btn btn-primary">返回产品列表</a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productDetail')) {
        new ProductDetailManager();
    }
});
