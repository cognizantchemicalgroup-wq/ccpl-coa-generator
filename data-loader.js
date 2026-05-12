/**
 * Data Loader - Fetches product data from JSON files
 * This allows the admin panel to update templates and have them
 * instantly reflected on the live website.
 * 
 * Usage: Include this script before your product data code
 * <script src="data-loader.js"></script>
 */

const DataLoader = {
    // Base path to JSON files (relative to this script)
    basePath: './data/',
    
    // Cache for loaded data
    cache: {
        rm: null,
        fg: null
    },
    
    /**
     * Load RM products from JSON file
     */
    async loadRMProducts() {
        if (this.cache.rm) {
            return this.cache.rm;
        }
        
        try {
            const response = await fetch(this.basePath + 'rm-products.json');
            if (!response.ok) throw new Error('Failed to load RM products');
            const data = await response.json();
            this.cache.rm = data.products || [];
            return this.cache.rm;
        } catch (error) {
            console.error('Error loading RM products:', error);
            return [];
        }
    },
    
    /**
     * Load FG products from JSON file
     */
    async loadFGProducts() {
        if (this.cache.fg) {
            return this.cache.fg;
        }
        
        try {
            const response = await fetch(this.basePath + 'fg-products.json');
            if (!response.ok) throw new Error('Failed to load FG products');
            const data = await response.json();
            this.cache.fg = data.products || [];
            return this.cache.fg;
        } catch (error) {
            console.error('Error loading FG products:', error);
            return [];
        }
    },
    
    /**
     * Load all products (both RM and FG)
     */
    async loadAllProducts() {
        const [rm, fg] = await Promise.all([
            this.loadRMProducts(),
            this.loadFGProducts()
        ]);
        
        return { rm, fg };
    },
    
    /**
     * Clear cache to force reload
     */
    clearCache() {
        this.cache.rm = null;
        this.cache.fg = null;
    },
    
    /**
     * Get product by code from RM or FG
     */
    async getProduct(code, category) {
        if (category === 'raw-material' || category === 'RM') {
            const products = await this.loadRMProducts();
            return products.find(p => p.code === code || p.chemicalName === code);
        } else if (category === 'finish-goods' || category === 'FG') {
            const products = await this.loadFGProducts();
            return products.find(p => p.code === code);
        }
        return null;
    }
};

// Auto-load on page ready
if (typeof window !== 'undefined') {
    window.DataLoader = DataLoader;
}