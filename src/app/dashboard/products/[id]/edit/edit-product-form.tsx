"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "../../create/page.module.css";

type Product = {
  slug: string; name: string; category: string; price: number; description: string;
  availability: "in-stock" | "made-to-order" | "out-of-stock";
  stock: number; status: "draft" | "published" | "archived"; featured: boolean;
};

export default function EditProductForm({ product }: { product: Product }) {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const form = new FormData(event.currentTarget);
    setStatus("Saving changes...");
    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"), category: form.get("category"), price: form.get("price"),
          description: form.get("description"), availability: form.get("availability"),
          stock: form.get("stock"), featured: form.has("featured"), status: submitter?.value ?? product.status,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update the product.");
      setStatus(result.message);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Unable to update the product."); }
  }

  return <>
    <header><h1>Edit Product</h1><nav aria-label="Breadcrumb"><Link href="/dashboard">Dashboard</Link><span>/</span><Link href="/dashboard/products">Products</Link><span>/</span><span aria-current="page">{product.name}</span></nav></header>
    <form onSubmit={handleSubmit}>
      <div className={styles.formFields}>
        <div className={styles.field}><label htmlFor="product-name">Product Name</label><input id="product-name" name="name" defaultValue={product.name} required /></div>
        <div className={styles.field}><label htmlFor="product-category">Category</label><select id="product-category" name="category" defaultValue={product.category} required>{["Home Decor","Jewelry","Accessories","Textiles","Pottery","Woodwork","More"].map(x=><option key={x}>{x}</option>)}</select></div>
        <div className={styles.splitFields}>
          <div className={styles.field}><label htmlFor="product-price">Price</label><div className={styles.priceInput}><span>$</span><input id="product-price" name="price" type="number" min="0" step="0.01" defaultValue={product.price} required /></div></div>
          <div className={styles.field}><label htmlFor="product-stock">Stock</label><input id="product-stock" name="stock" type="number" min="0" step="1" defaultValue={product.stock} required /></div>
        </div>
        <div className={styles.field}><label htmlFor="product-availability">Availability</label><select id="product-availability" name="availability" defaultValue={product.availability}><option value="in-stock">In Stock</option><option value="made-to-order">Made to Order</option><option value="out-of-stock">Out of Stock</option></select></div>
        <div className={styles.field}><label htmlFor="product-description">Description</label><textarea id="product-description" name="description" rows={7} defaultValue={product.description} required /></div>
        <label><input type="checkbox" name="featured" defaultChecked={product.featured} /> Feature this product on the marketplace</label>
      </div>
      <div className={styles.imageField}><h2>Product Status</h2><div className={styles.dropzone}><strong>Current status: {product.status}</strong><span>Use the actions below to save as draft, publish, or archive.</span><small>Product URL: /products/{product.slug}</small></div></div>
      <div className={styles.actions}><Link href="/dashboard/products">Cancel</Link><button type="submit" value="archived">Archive</button><button type="submit" value="draft">Save as Draft</button><button className={styles.publish} type="submit" value="published">Save &amp; Publish</button></div>
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </form>
  </>;
}
