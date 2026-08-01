"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./site-chrome.module.css";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l1.8 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.5L20 8H6" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

export default function CartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/cart", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (result) setCount(result.cart.itemCount); })
      .catch(() => undefined);

    function update(event: Event) {
      setCount(Number((event as CustomEvent<number>).detail) || 0);
    }
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  return (
    <Link className={styles.cartLink} href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
      <CartIcon />
      {count > 0 && <span className={styles.cartCount}>{count}</span>}
    </Link>
  );
}
