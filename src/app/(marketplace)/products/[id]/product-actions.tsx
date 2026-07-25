"use client";

import { useState } from "react";
import styles from "./page.module.css";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l1.8 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.5L20 8H6" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 5.8a5.2 5.2 0 0 0-7.4 0L12 7.2l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 22l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" />
    </svg>
  );
}

export default function ProductActions() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={styles.actions}>
      <div className={styles.quantityRow}>
        <span>Quantity:</span>
        <div className={styles.stepper}>
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity === 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            −
          </button>
          <output aria-live="polite" aria-label="Quantity">
            {quantity}
          </output>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button className={styles.addToCart} type="button">
        <CartIcon />
        Add to Cart
      </button>
      <button className={styles.wishlist} type="button">
        <HeartIcon />
        Add to Wishlist
      </button>
    </div>
  );
}
