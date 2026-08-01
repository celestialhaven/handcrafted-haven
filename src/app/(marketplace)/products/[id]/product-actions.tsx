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

export default function ProductActions({ productId, disabled = false, maxQuantity = 0 }: { productId: string; disabled?: boolean; maxQuantity?: number }) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [adding, setAdding] = useState(false);

  async function addToCart() {
    setAdding(true);
    setStatus("");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const result = await response.json();
      if (response.status === 401) {
        window.location.href = `/sign-in?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (!response.ok) throw new Error(result.error || "Unable to add this product.");
      setStatus(`${quantity} ${quantity === 1 ? "item" : "items"} added to your cart.`);
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: result.cart.itemCount }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to add this product.");
    } finally {
      setAdding(false);
    }
  }

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
            disabled={maxQuantity > 0 && quantity >= maxQuantity}
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button className={styles.addToCart} type="button" disabled={disabled || adding} onClick={addToCart}>
        <CartIcon />
        {disabled ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
      </button>
      {status && <p role="status" aria-live="polite">{status}</p>}
      <button className={styles.wishlist} type="button">
        <HeartIcon />
        Add to Wishlist
      </button>
    </div>
  );
}
