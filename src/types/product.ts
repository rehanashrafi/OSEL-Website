export interface LedProduct { name: string; slug: string; }
export interface ProductFamily extends LedProduct { products: readonly LedProduct[]; }
