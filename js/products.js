// Products Page - Search & Filter Functionality

class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.productsGrid = document.getElementById('productsGrid');
        this.noResults = document.getElementById('noResults');
        
        this.init();
    }

    async init() {
        // Load products from JSON
        this.products = await fetchProducts();
        
        // Check for category parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            this.currentCategory = categoryParam;
            this.updateActiveFilter(categoryParam);
        }
        
        // Setup event listeners
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterProducts();
            });
        }

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.target.dataset.category;
                this.updateActiveFilter(this.currentCategory);
                this.filterProducts();
            });
        });

        // Initial render
        this.filterProducts();
    }

    updateActiveFilter(category) {
        this.filterButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            const categoryMatch = this.currentCategory === 'all' || 
                                product.category === this.currentCategory;
            
            // Search filter
            const searchMatch = !this.searchTerm || 
                               product.name.toLowerCase().includes(this.searchTerm) ||
                               product.description.toLowerCase().includes(this.searchTerm) ||
                               product.category.toLowerCase().includes(this.searchTerm);
            
            return categoryMatch && searchMatch;
        });

        this.renderProducts();
    }

    renderProducts() {
        if (!this.productsGrid) return;

        if (this.filteredProducts.length === 0) {
            this.productsGrid.style.display = 'none';
            if (this.noResults) {
                this.noResults.style.display = 'block';
            }
        } else {
            this.productsGrid.style.display = 'grid';
            if (this.noResults) {
                this.noResults.style.display = 'none';
            }
            
            // Add fade-in animation
            this.productsGrid.style.opacity = '0';
            
            this.productsGrid.innerHTML = this.filteredProducts
                .map(product => createProductCard(product))
                .join('');
            
            // Fade in after a short delay
            setTimeout(() => {
                this.productsGrid.style.transition = 'opacity 0.3s ease';
                this.productsGrid.style.opacity = '1';
            }, 50);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsGrid')) {
        new ProductsManager();
    }
});
