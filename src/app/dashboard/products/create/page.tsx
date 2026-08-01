"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m5 18 5-5 3 3 2-2 4 4" />
    </svg>
  );
}

export default function CreateProductPage() {
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("Saving product...");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          category: data.get("category"),
          price: data.get("price"),
          availability: data.get("availability"),
          description: data.get("description"),
          status: submitter?.value === "publish" ? "published" : "draft",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save the product.");
      setStatus(submitter?.value === "draft" ? "Product saved as a draft." : "Product published successfully.");
      form.reset();
      setFileName("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save the product.");
    }
  }

  return (
    <main className={styles.createPage} data-create-product>
      <header>
        <h1>Create a New Product</h1>
        <nav aria-label="Breadcrumb">
          <Link href="/dashboard">Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/products">Products</Link>
          <span>/</span>
          <span aria-current="page">Create</span>
        </nav>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.formFields}>
          <div className={styles.field}>
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              name="name"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="product-category">Category</label>
            <select id="product-category" name="category" defaultValue="" required>
              <option value="" disabled>Select category</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Accessories">Accessories</option>
              <option value="Textiles">Textiles</option>
              <option value="Pottery">Pottery</option>
              <option value="Woodwork">Woodwork</option>
            </select>
          </div>

          <div className={styles.splitFields}>
            <div className={styles.field}>
              <label htmlFor="product-price">Price</label>
              <div className={styles.priceInput}>
                <span>$</span>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="product-availability">Availability</label>
              <select id="product-availability" name="availability" defaultValue="in-stock">
                <option value="in-stock">In Stock</option>
                <option value="made-to-order">Made to Order</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              name="description"
              rows={7}
              placeholder="Write a detailed description..."
              required
            />
          </div>
        </div>

        <div className={styles.imageField}>
          <h2>Product Image</h2>
          <label className={styles.dropzone}>
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            />
            <UploadIcon />
            <strong>{fileName || "Click to upload"}</strong>
            <span>{fileName ? "Image selected" : "or drag and drop"}</span>
            <small>PNG, JPG, up to 5MB</small>
          </label>
        </div>

        <div className={styles.actions}>
          <Link href="/dashboard/products">Cancel</Link>
          <button type="submit" name="intent" value="draft">Save as Draft</button>
          <button className={styles.publish} type="submit" name="intent" value="publish">
            Publish Product
          </button>
        </div>

        <p className={styles.status} role="status" aria-live="polite">{status}</p>
      </form>
    </main>
  );
}
