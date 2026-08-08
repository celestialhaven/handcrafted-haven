import Link from "next/link";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { requireArtisanSession } from "@/lib/auth";
import { Artisan, Order, Product, Review } from "@/models";
import styles from "./page.module.css";

type ProductRow = { _id: { toString(): string }; slug: string; name: string; price: number; stock: number; availability: string };

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
}

async function DashboardData() {
  const session = await requireArtisanSession();
  await connectToDatabase();
  const artisan = await Artisan.findOne({ user: session.userId }).select("_id").lean();

  if (!artisan) return <p>No artisan profile is connected to this account.</p>;

  const [products, orderSummary, reviewSummary, productCount] = await Promise.all([
    Product.find({ artisan: artisan._id }).select("slug name price stock availability").sort({ createdAt: -1 }).limit(5).lean<ProductRow[]>(),
    Order.aggregate<{ orderCount: number; unitsSold: number; earnings: number }>([
      { $match: { "items.artisan": artisan._id, status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      { $match: { "items.artisan": artisan._id } },
      { $group: { _id: null, orders: { $addToSet: "$_id" }, unitsSold: { $sum: "$items.quantity" }, earnings: { $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] } } } },
      { $project: { _id: 0, orderCount: { $size: "$orders" }, unitsSold: 1, earnings: 1 } },
    ]),
    Review.aggregate<{ average: number; count: number }>([
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "productRecord" } },
      { $match: { "productRecord.artisan": artisan._id } },
      { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]),
    Product.countDocuments({ artisan: artisan._id }),
  ]);

  const orders = orderSummary[0] ?? { orderCount: 0, unitsSold: 0, earnings: 0 };
  const reviews = reviewSummary[0] ?? { average: 0, count: 0 };
  const metrics = [
    { label: "Total Orders", value: String(orders.orderCount) },
    { label: "Total Sales", value: String(orders.unitsSold) },
    { label: "Total Products", value: String(productCount) },
    { label: "Total Reviews", value: reviews.count ? `${reviews.average.toFixed(1)} ★` : "No reviews" },
    { label: "Earnings", value: `$${orders.earnings.toFixed(2)}` },
  ];

  return <>
    <section className={styles.metrics} aria-label="Seller overview">{metrics.map((metric) => <article key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong></article>)}</section>
    <section className={styles.recentProducts}>
      <div className={styles.sectionHeading}><h2>Recent Products</h2><Link href="/dashboard/products">View All Products <span aria-hidden="true">›</span></Link></div>
      <div className={styles.tableWrap}><table><thead><tr><th>Product</th><th>Product Name</th><th>Price</th><th>Status</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
        {products.length ? products.map((product) => <tr key={product._id.toString()}><td><div className={styles.productImage} aria-label={`${product.name} image`} /></td><td>{product.name}</td><td>${product.price.toFixed(2)}</td><td><span className={styles.statusDot} /> {product.availability.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")}</td><td>{product.stock}</td><td><Link href={`/dashboard/products/${product.slug}/edit`}>Edit</Link></td></tr>) : <tr><td colSpan={6}>No products yet.</td></tr>}
      </tbody></table></div>
    </section>
  </>;
}

function DashboardSkeleton() {
  return <div aria-label="Loading dashboard" aria-busy="true"><section className={styles.metrics}>{Array.from({ length: 5 }, (_, index) => <article key={index}><p>Loading…</p><strong>—</strong></article>)}</section></div>;
}

export default function Dashboard() {
  return <main className={styles.dashboard}><div className={styles.pageHeading}><h1>Dashboard</h1><button type="button" aria-label="Search dashboard"><SearchIcon /></button></div><Suspense fallback={<DashboardSkeleton />}><DashboardData /></Suspense></main>;
}
