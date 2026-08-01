"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  availability: string;
  stock: number;
  artisanName: string;
  artisanSlug: string;
  quantity: number;
  lineTotal: number;
};

type CartData = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
};

const emptyCart: CartData = { items: [], itemCount: 0, subtotal: 0, shipping: 0, total: 0 };

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function CartClient() {
  const [cart, setCart] = useState<CartData>(emptyCart);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/cart", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load your cart.");
        if (active) {
          setCart(result.cart);
          window.dispatchEvent(new CustomEvent("cart-updated", { detail: result.cart.itemCount }));
        }
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : "Unable to load your cart.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function updateItem(productId: string, quantity: number) {
    setUpdating(productId);
    setError("");
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update the item.");
      setCart(result.cart);
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: result.cart.itemCount }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update the item.");
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(productId: string) {
    setUpdating(productId);
    setError("");
    try {
      const response = await fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to remove the item.");
      setCart(result.cart);
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: result.cart.itemCount }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to remove the item.");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <main className={styles.cartPage}><p className={styles.loading}>Loading your cart…</p></main>;

  return (
    <main className={styles.cartPage}>
      <header className={styles.heading}>
        <div><h1>Your Shopping Cart</h1><p>{cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}</p></div>
        <Link href="/products">Continue Shopping</Link>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      {cart.items.length === 0 ? (
        <section className={styles.empty}>
          <span aria-hidden="true">◇</span>
          <h2>Your cart is empty</h2>
          <p>Explore unique pieces made by independent artisans.</p>
          <Link href="/products">Browse Products</Link>
        </section>
      ) : (
        <div className={styles.cartLayout}>
          <section className={styles.items} aria-label="Cart items">
            {cart.items.map((item) => (
              <article className={styles.item} key={item.productId} aria-busy={updating === item.productId}>
                <Link className={styles.image} href={`/products/${item.slug}`} aria-label={`View ${item.name}`}>
                  {item.imageUrl ? <Image src={item.imageUrl} alt="" width={145} height={126} unoptimized /> : <span>Product image</span>}
                </Link>
                <div className={styles.itemInfo}>
                  <Link href={`/products/${item.slug}`}><h2>{item.name}</h2></Link>
                  {item.artisanSlug ? <Link className={styles.artisan} href={`/artisans/${item.artisanSlug}`}>by {item.artisanName}</Link> : <p className={styles.artisan}>by {item.artisanName}</p>}
                  <p className={styles.availability}>{item.availability.replaceAll("-", " ")}</p>
                  <button className={styles.remove} type="button" disabled={updating === item.productId} onClick={() => removeItem(item.productId)}>Remove</button>
                </div>
                <div className={styles.quantity} aria-label={`Quantity for ${item.name}`}>
                  <button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1 || updating === item.productId} onClick={() => updateItem(item.productId, item.quantity - 1)}>−</button>
                  <output>{item.quantity}</output>
                  <button type="button" aria-label={`Increase ${item.name} quantity`} disabled={(item.stock > 0 && item.quantity >= item.stock) || updating === item.productId} onClick={() => updateItem(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className={styles.itemPrice}><strong>{money(item.lineTotal)}</strong><small>{money(item.price)} each</small></div>
              </article>
            ))}
          </section>

          <aside className={styles.summary}>
            <h2>Order Summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{cart.shipping === 0 ? "Free" : money(cart.shipping)}</dd></div>
              <div className={styles.total}><dt>Total</dt><dd>{money(cart.total)}</dd></div>
            </dl>
            {cart.subtotal < 100 && <p>Add {money(100 - cart.subtotal)} more for free shipping.</p>}
            <button type="button">Proceed to Checkout</button>
            <small>Taxes are calculated at checkout.</small>
          </aside>
        </div>
      )}
    </main>
  );
}
