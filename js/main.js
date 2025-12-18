// Main JavaScript - Theme Toggle & Mobile Menu

// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeIcon();
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.querySelector('.nav-menu');
        
        if (this.menuToggle && this.navMenu) {
            this.init();
        }
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on a link
        const navLinks = this.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && 
                !this.menuToggle.contains(e.target) && 
                this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
    }
}

// Utility: Fetch Products Data
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Utility: Create Product Card HTML
function createProductCard(product) {
    return `
        <a href="product-detail.html?id=${product.id}" class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23f5f5f7\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'14\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E产品图片%3C/text%3E%3C/svg%3E'">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price}</div>
        </a>
    `;
}

// Load Featured Products on Homepage
async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const products = await fetchProducts();
    const featured = products.slice(0, 3); // Show first 3 products
    
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new MobileMenu();
    
    // Load featured products if on homepage
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
});
