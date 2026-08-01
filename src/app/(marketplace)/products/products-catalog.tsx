"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  ratingCount: number;
  imageUrl: string;
  createdAt: string;
};

type SortOption = "newest" | "price-low" | "price-high" | "rating";

export default function ProductsCatalog({ products, categories, initialCategory, query }: { products: CatalogProduct[]; categories: string[]; initialCategory?: string; query?: string }) {
  const validInitialCategory = initialCategory && categories.includes(initialCategory) ? [initialCategory] : [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(validInitialCategory);
  const highestPrice = Math.max(500, ...products.map((product) => Math.ceil(product.price / 10) * 10));
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => product.price <= maxPrice && (selectedCategories.length === 0 || selectedCategories.includes(product.category)));
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [maxPrice, products, selectedCategories, sortBy]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  }

  return (
    <main className={styles.catalog}>
      <aside className={styles.filters}>
        <h2>Filters</h2>
        <fieldset>
          <legend>Categories</legend>
          <label><input type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} />All Categories</label>
          {categories.map((category) => <label key={category}><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} />{category}</label>)}
        </fieldset>
        <div className={styles.priceFilter}>
          <h3>Price Range</h3>
          <div><span>$0</span><span>${maxPrice}{maxPrice === highestPrice ? "+" : ""}</span></div>
          <input type="range" min="0" max={highestPrice} step="10" value={maxPrice} aria-label="Maximum price" onChange={(event) => setMaxPrice(Number(event.target.value))} />
        </div>
        <label className={styles.sortFilter}>
          <strong>Sort By</strong>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}><option value="newest">Newest First</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Highest Rated</option></select>
        </label>
      </aside>

      <section className={styles.results}>
        <div className={styles.resultsHeader}>
          <div><h1>{query ? `Results for “${query}”` : "All Products"}</h1><p>Showing {visibleProducts.length} of {products.length} products</p></div>
          <label><span className={styles.srOnly}>Sort products</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}><option value="newest">Sort By</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Highest Rated</option></select></label>
        </div>

        {visibleProducts.length ? (
          <div className={styles.productGrid}>
            {visibleProducts.map((product) => (
              <Link className={styles.productCard} href={`/products/${product.slug}`} key={product.id}>
                <div className={styles.productImage} role="img" aria-label={`${product.name} image`} />
                <div className={styles.productInfo}><h2>{product.name}</h2><strong>${product.price.toFixed(2)}</strong><p aria-label={`${product.rating} out of 5 stars`}>★★★★★ <span>({product.ratingCount})</span></p></div>
              </Link>
            ))}
          </div>
        ) : <p className={styles.empty}>No products match the selected filters.</p>}
      </section>
    </main>
  );
}
