import Link from "next/link";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { requireArtisanSession } from "@/lib/auth";
import { Artisan, Product } from "@/models";
import styles from "./page.module.css";

type PageProps = { searchParams: Promise<{ q?: string; status?: string; category?: string }> };
type ProductRecord = {
  _id: { toString(): string };
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  availability: "in-stock" | "made-to-order" | "out-of-stock";
  stock: number;
  status: "draft" | "published" | "archived";
};

const allowedStatuses = ["draft", "published", "archived"];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
}

function PlusIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function availabilityLabel(value: ProductRecord["availability"]) {
  return value.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

async function ProductsTable({ query, status, category }: { query: string; status: string; category: string }) {
  const session = await requireArtisanSession();
  await connectToDatabase();
  const artisan = await Artisan.findOne({ user: session.userId }).select("_id").lean();
  if (!artisan) return <div className={styles.empty}><h2>No artisan profile found</h2><p>This account needs an artisan profile before products can be managed.</p></div>;

  const filter: Record<string, unknown> = { artisan: artisan._id };
  if (query) filter.$or = [
    { name: { $regex: escapeRegex(query), $options: "i" } },
    { category: { $regex: escapeRegex(query), $options: "i" } },
  ];
  if (allowedStatuses.includes(status)) filter.status = status;
  if (category) filter.category = category;

  const [products, totalCount, publishedCount, draftCount] = await Promise.all([
    Product.find(filter).select("slug name category price images availability stock status").sort({ createdAt: -1 }).lean<ProductRecord[]>(),
    Product.countDocuments({ artisan: artisan._id }),
    Product.countDocuments({ artisan: artisan._id, status: "published" }),
    Product.countDocuments({ artisan: artisan._id, status: "draft" }),
  ]);

  return <>
    <section className={styles.summary} aria-label="Product summary">
      <article><span>All Products</span><strong>{totalCount}</strong></article>
      <article><span>Published</span><strong>{publishedCount}</strong></article>
      <article><span>Drafts</span><strong>{draftCount}</strong></article>
      <article><span>Low Stock</span><strong>{await Product.countDocuments({ artisan: artisan._id, stock: { $lte: 5 }, availability: { $ne: "out-of-stock" } })}</strong></article>
    </section>

    <div className={styles.tableWrap}>
      <table>
        <thead><tr><th>Product</th><th>Product Name</th><th>Category</th><th>Price</th><th>Availability</th><th>Stock</th><th>Publication</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map((product) => <tr key={product._id.toString()}>
            <td><div className={styles.productImage} role="img" aria-label={`${product.name} image`}>{product.images?.[0] ? <span>{product.name.charAt(0)}</span> : null}</div></td>
            <td><strong>{product.name}</strong></td>
            <td>{product.category}</td>
            <td>${product.price.toFixed(2)}</td>
            <td><span className={`${styles.stockDot} ${styles[product.availability.replaceAll("-", "")]}`} />{availabilityLabel(product.availability)}</td>
            <td>{product.stock}</td>
            <td><span className={`${styles.status} ${styles[product.status]}`}>{product.status}</span></td>
            <td><div className={styles.actions}><Link href={`/products/${product.slug}`}>View</Link><Link href={`/dashboard/products/${product.slug}/edit`}>Edit</Link></div></td>
          </tr>)}
        </tbody>
      </table>
      {!products.length && <div className={styles.empty}><h2>No products found</h2><p>Try changing the filters or add your first handcrafted product.</p><Link href="/dashboard/products/create">Add Product</Link></div>}
    </div>
  </>;
}

function ProductsSkeleton() {
  return <div aria-label="Loading products" aria-busy="true"><section className={`${styles.summary} ${styles.skeleton}`}>{Array.from({ length: 4 }, (_, index) => <article key={index}><span /><strong /></article>)}</section><div className={`${styles.tableWrap} ${styles.skeletonTable}`} /></div>;
}

export default async function DashboardProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = params.status ?? "";
  const category = params.category ?? "";
  return <main className={styles.productsPage}>
    <header className={styles.heading}><div><h1>Products</h1><p>Manage your product catalog, inventory, and publication status.</p></div><Link className={styles.addButton} href="/dashboard/products/create"><PlusIcon />Add New Product</Link></header>
    <form className={styles.filters} action="/dashboard/products">
      <label className={styles.search}><span className={styles.srOnly}>Search products</span><SearchIcon /><input name="q" type="search" placeholder="Search products..." defaultValue={query} /></label>
      <select name="status" defaultValue={status} aria-label="Filter by publication status"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
      <select name="category" defaultValue={category} aria-label="Filter by category"><option value="">All categories</option>{["Home Decor", "Jewelry", "Accessories", "Textiles", "Pottery", "Woodwork", "More"].map((item) => <option value={item} key={item}>{item}</option>)}</select>
      <button type="submit">Apply Filters</button>
      {(query || status || category) && <Link href="/dashboard/products">Clear</Link>}
    </form>
    <Suspense key={`${query}:${status}:${category}`} fallback={<ProductsSkeleton />}><ProductsTable query={query} status={status} category={category} /></Suspense>
  </main>;
}
