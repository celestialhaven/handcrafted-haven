import Link from "next/link";
import ProductActions from "./product-actions";
import styles from "./page.module.css";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const thumbnails = Array.from({ length: 5 }, (_, index) => index + 1);

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <main className={styles.productPage}>
      <section className={styles.productOverview}>
        <div className={styles.gallery}>
          <div className={styles.mainImage} role="img" aria-label="Product image">
            <span>Product image</span>
          </div>
          <div className={styles.thumbnails} aria-label="Product images">
            {thumbnails.map((thumbnail) => (
              <button
                className={thumbnail === 1 ? styles.selectedThumbnail : undefined}
                type="button"
                aria-label={`View product image ${thumbnail}`}
                key={thumbnail}
              >
                <span />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <h1>Product Name</h1>
          <p className={styles.byline}>
            by <Link href="/artisans/artisan-name">Artisan Name</Link>
          </p>
          <p className={styles.rating} aria-label="4 out of 5 stars, 18 reviews">
            ★★★★☆ <span>(18)</span>
          </p>
          <p className={styles.price}>$90.00</p>
          <p className={styles.summary}>
            Carefully handcrafted with quality materials and thoughtful details,
            made to bring warmth and character to your everyday life.
          </p>
          <dl className={styles.details}>
            <div>
              <dt>Category:</dt>
              <dd>Home Decor</dd>
            </div>
            <div>
              <dt>Availability:</dt>
              <dd>In Stock</dd>
            </div>
            <div>
              <dt>Product ID:</dt>
              <dd>{id}</dd>
            </div>
          </dl>
          <ProductActions />
        </div>
      </section>

      <section className={styles.lowerContent}>
        <div className={styles.productDetails}>
          <div className={styles.tabs} role="tablist" aria-label="Product details">
            <button className={styles.activeTab} type="button" role="tab" aria-selected="true">
              Description
            </button>
            <button type="button" role="tab" aria-selected="false">
              Reviews (18)
            </button>
            <button type="button" role="tab" aria-selected="false">
              Shipping &amp; Returns
            </button>
          </div>

          <div className={styles.description}>
            <p>
              Every piece is made with care by an independent artisan. Natural
              variations are part of its handmade character, making each item
              genuinely one of a kind.
            </p>
            <h2>Customer Reviews</h2>
            <p>No reviews yet. Be the first to review this product.</p>
            <button className={styles.reviewButton} type="button">
              Write a Review
            </button>
          </div>
        </div>

        <aside className={styles.artisanCard}>
          <h2>About the Artisan</h2>
          <div className={styles.artisan}>
            <div className={styles.avatar} aria-hidden="true" />
            <div>
              <strong>Artisan Name</strong>
              <span>Location</span>
              <Link href="/artisans/artisan-name">View Profile</Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
