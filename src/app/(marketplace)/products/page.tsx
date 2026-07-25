"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

const categories = [
  "Home Decor",
  "Jewelry",
  "Accessories",
  "Textiles",
  "Pottery",
  "Woodwork",
  "More",
];

const products = [
  { id: "ceramic-mug", name: "Ceramic Mug", category: "Pottery", price: 32, rating: 4.8 },
  { id: "woven-basket", name: "Woven Basket", category: "Home Decor", price: 58, rating: 4.9 },
  { id: "silver-pendant", name: "Silver Pendant", category: "Jewelry", price: 75, rating: 4.7 },
  { id: "linen-tote", name: "Linen Tote", category: "Accessories", price: 42, rating: 4.6 },
  { id: "throw-blanket", name: "Woven Throw", category: "Textiles", price: 96, rating: 5.0 },
  { id: "wood-serving-board", name: "Serving Board", category: "Woodwork", price: 64, rating: 4.8 },
  { id: "clay-vase", name: "Clay Vase", category: "Pottery", price: 88, rating: 4.9 },
  { id: "beaded-earrings", name: "Beaded Earrings", category: "Jewelry", price: 28, rating: 4.5 },
  { id: "soy-candle", name: "Soy Candle", category: "Home Decor", price: 24, rating: 4.7 },
  { id: "embroidered-pouch", name: "Embroidered Pouch", category: "Accessories", price: 36, rating: 4.6 },
  { id: "table-runner", name: "Table Runner", category: "Textiles", price: 48, rating: 4.8 },
  { id: "artisan-gift-set", name: "Artisan Gift Set", category: "More", price: 120, rating: 5.0 },
];

type SortOption = "newest" | "price-low" | "price-high" | "rating";

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        product.price <= maxPrice &&
        (selectedCategories.length === 0 || selectedCategories.includes(product.category)),
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [maxPrice, selectedCategories, sortBy]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  return (
    <main className={styles.catalog}>
      <aside className={styles.filters}>
        <h2>Filters</h2>

        <fieldset>
          <legend>Categories</legend>
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.length === 0}
              onChange={() => setSelectedCategories([])}
            />
            All Categories
          </label>
          {categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}
        </fieldset>

        <div className={styles.priceFilter}>
          <h3>Price Range</h3>
          <div>
            <span>$0</span>
            <span>${maxPrice}{maxPrice === 500 ? "+" : ""}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={maxPrice}
            aria-label="Maximum price"
            onChange={(event) => setMaxPrice(Number(event.target.value))}
          />
        </div>

        <label className={styles.sortFilter}>
          <strong>Sort By</strong>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </label>
      </aside>

      <section className={styles.results}>
        <div className={styles.resultsHeader}>
          <div>
            <h1>All Products</h1>
            <p>
              Showing {visibleProducts.length} of {products.length} products
            </p>
          </div>
          <label>
            <span className={styles.srOnly}>Sort products</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
              <option value="newest">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </label>
        </div>

        {visibleProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {visibleProducts.map((product) => (
              <Link className={styles.productCard} href={`/products/${product.id}`} key={product.id}>
                <div className={styles.productImage} role="img" aria-label={`${product.name} image`} />
                <div className={styles.productInfo}>
                  <h2>{product.name}</h2>
                  <strong>${product.price.toFixed(2)}</strong>
                  <p aria-label={`${product.rating} out of 5 stars`}>
                    ★★★★☆ <span>({Math.round(product.rating * 3)})</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No products match the selected filters.</p>
        )}

        <nav className={styles.pagination} aria-label="Product pages">
          <Link className={styles.currentPage} href="/products?page=1" aria-current="page">1</Link>
          <Link href="/products?page=2">2</Link>
          <Link href="/products?page=3">3</Link>
          <Link href="/products?page=4">4</Link>
          <Link href="/products?page=5">5</Link>
          <span>…</span>
          <Link href="/products?page=10">10</Link>
          <Link href="/products?page=2" aria-label="Next page">›</Link>
        </nav>
      </section>
    </main>
  );
}
