import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { Product, Review } from "@/models";
import ProductActions from "./product-actions";
import styles from "./page.module.css";

type ProductPageProps = { params: Promise<{ id: string }> };
type ProductView = {
  _id: { toString(): string };
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  availability: "in-stock" | "made-to-order" | "out-of-stock";
  stock: number;
  ratingAverage: number;
  ratingCount: number;
  artisan: { displayName: string; slug: string; location: string; bio: string };
};

function availabilityLabel(value: ProductView["availability"]) {
  return value.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const session = await getSession();
  const artisanSession = session?.role === "artisan" || session?.role === "admin";
  await connectToDatabase();
  const product = await Product.findOne({ slug: id, status: "published" })
    .populate("artisan", "displayName slug location bio")
    .lean<ProductView>();
  if (!product) notFound();
  const reviews = await Review.find({ product: product._id }).populate("user", "name").sort({ createdAt: -1 }).lean();
  const imageCount = Math.max(product.images?.length ?? 0, 1);

  return (
    <main className={styles.productPage}>
      <section className={styles.productOverview}>
        <div className={styles.gallery}>
          <div className={styles.mainImage} role="img" aria-label={`${product.name} image`}><span>{product.name}</span></div>
          <div className={styles.thumbnails} aria-label="Product images">
            {Array.from({ length: imageCount }, (_, index) => index + 1).map((thumbnail) => (
              <button className={thumbnail === 1 ? styles.selectedThumbnail : undefined} type="button" aria-label={`View product image ${thumbnail}`} key={thumbnail}><span /></button>
            ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <h1>{product.name}</h1>
          <p className={styles.byline}>by <Link href={`/artisans/${product.artisan.slug}`}>{product.artisan.displayName}</Link></p>
          <p className={styles.rating} aria-label={`${product.ratingAverage} out of 5 stars, ${product.ratingCount} reviews`}>★★★★★ <span>({product.ratingCount})</span></p>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p className={styles.summary}>{product.description}</p>
          <dl className={styles.details}>
            <div><dt>Category:</dt><dd>{product.category}</dd></div>
            <div><dt>Availability:</dt><dd>{availabilityLabel(product.availability)}</dd></div>
            <div><dt>Product ID:</dt><dd>{product.slug}</dd></div>
          </dl>
          <ProductActions productId={product._id.toString()} disabled={product.availability === "out-of-stock"} maxQuantity={product.stock} />
          {artisanSession && <Link className={styles.manageProduct} href="/dashboard/products">Manage My Products</Link>}
        </div>
      </section>

      <section className={styles.lowerContent}>
        <div className={styles.productDetails}>
          <div className={styles.tabs} role="tablist" aria-label="Product details">
            <button className={styles.activeTab} type="button" role="tab" aria-selected="true">Description</button>
            <button type="button" role="tab" aria-selected="false">Reviews ({reviews.length})</button>
            <button type="button" role="tab" aria-selected="false">Shipping &amp; Returns</button>
          </div>
          <div className={styles.description}>
            <p>{product.description}</p>
            <h2>Customer Reviews</h2>
            {reviews.length ? reviews.map((review) => <article key={review._id.toString()}><strong>{review.title || `${review.rating} star review`}</strong><p>{review.comment}</p></article>) : <p>No reviews yet. Be the first to review this product.</p>}
            <button className={styles.reviewButton} type="button">Write a Review</button>
          </div>
        </div>
        <aside className={styles.artisanCard}>
          <h2>About the Artisan</h2>
          <div className={styles.artisan}><div className={styles.avatar} aria-hidden="true" /><div><strong>{product.artisan.displayName}</strong><span>{product.artisan.location}</span><Link href={`/artisans/${product.artisan.slug}`}>View Profile</Link></div></div>
        </aside>
      </section>
    </main>
  );
}
