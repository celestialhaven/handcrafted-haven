import Link from "next/link";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, Product } from "@/models";
import styles from "./page.module.css";

const benefits = [
  { icon: "♡", line1: "Handmade", line2: "with Care" },
  { icon: "♙", line1: "Support", line2: "Artisans" },
  { icon: "♧", line1: "Sustainable", line2: "Choices" },
  { icon: "◇", line1: "Secure", line2: "Shopping" },
];

const categoryIcons: Record<string, string> = {
  "Home Decor": "⌂",
  Jewelry: "◇",
  Accessories: "♧",
  Textiles: "▧",
  Pottery: "◉",
  Woodwork: "▤",
  More: "•••",
};

type FeaturedProduct = {
  _id: { toString(): string };
  slug: string;
  name: string;
  price: number;
  ratingAverage: number;
  ratingCount: number;
  images: string[];
};

type FeaturedArtisan = {
  _id: { toString(): string };
  slug: string;
  displayName: string;
  location: string;
  ratingAverage: number;
  ratingCount: number;
  profileImageUrl: string;
};

type CategoryCount = { _id: string; count: number };

function SectionHeading({ children, href }: { children: React.ReactNode; href: string }) {
  return <div className={styles.sectionHeading}><h2>{children}</h2><Link href={href}>View all</Link></div>;
}

async function CategoriesSection() {
  await connectToDatabase();
  const categoryCounts = await Product.aggregate<CategoryCount>([
    { $match: { status: "published" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 6 },
  ]);

  return (
    <section className={styles.homeSection}>
      <SectionHeading href="/products">Shop by Category</SectionHeading>
      <div className={styles.categoryGrid}>
        {categoryCounts.map((category) => (
          <Link className={styles.categoryCard} href={`/products?category=${encodeURIComponent(category._id)}`} key={category._id}>
            <span aria-hidden="true">{categoryIcons[category._id] ?? "◇"}</span>
            <strong>{category._id}</strong>
            <small>{category.count} {category.count === 1 ? "product" : "products"}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function FeaturedProductsSection() {
  await connectToDatabase();
  const products = await Product.find({ status: "published" }).sort({ featured: -1, ratingAverage: -1, createdAt: -1 }).limit(5).lean<FeaturedProduct[]>();

  return (
    <section className={styles.homeSection}>
      <SectionHeading href="/products">Featured Products</SectionHeading>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <Link className={styles.productCard} href={`/products/${product.slug}`} key={product._id.toString()}>
            <div className={styles.productImage} aria-label={`${product.name} image`}><span>{product.name} image</span></div>
            <div className={styles.productInfo}>
              <strong>{product.name}</strong>
              <span>${product.price.toFixed(2)}</span>
              <p aria-label={`${product.ratingAverage} out of 5 stars`}>★★★★★ <small>({product.ratingCount})</small></p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function FeaturedArtisansSection() {
  await connectToDatabase();
  const artisans = await Artisan.find({}).sort({ ratingAverage: -1, ratingCount: -1 }).limit(4).lean<FeaturedArtisan[]>();

  return (
    <section className={styles.homeSection}>
      <SectionHeading href="/artisans">Featured Artisans</SectionHeading>
      <div className={styles.artisanGrid}>
        {artisans.map((artisan) => (
          <article className={styles.artisanCard} key={artisan._id.toString()}>
            <div className={styles.avatar} aria-label={`${artisan.displayName} profile image`} />
            <div className={styles.artisanInfo}>
              <strong>{artisan.displayName}</strong>
              <span>{artisan.location || "Location not provided"}</span>
              <small aria-label={`${artisan.ratingAverage} out of 5 stars`}>★ {artisan.ratingAverage.toFixed(1)} ({artisan.ratingCount})</small>
              <Link href={`/artisans/${artisan.slug}`}>View Profile</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkeletonBar({ width = "70%" }: { width?: string }) {
  return <span className={styles.skeletonBar} style={{ width }} />;
}

function CategoriesSkeleton() {
  return (
    <section className={styles.homeSection} aria-label="Loading product categories" aria-busy="true">
      <div className={styles.skeletonHeading}><SkeletonBar width="180px" /></div>
      <div className={styles.categoryGrid}>{Array.from({ length: 6 }, (_, index) => <div className={`${styles.categoryCard} ${styles.skeletonCard}`} key={index}><span className={styles.skeletonCircle} /><SkeletonBar width="65%" /><SkeletonBar width="45%" /></div>)}</div>
    </section>
  );
}

function ProductsSkeleton() {
  return (
    <section className={styles.homeSection} aria-label="Loading featured products" aria-busy="true">
      <div className={styles.skeletonHeading}><SkeletonBar width="190px" /></div>
      <div className={styles.productGrid}>{Array.from({ length: 5 }, (_, index) => <div className={`${styles.productCard} ${styles.skeletonCard}`} key={index}><div className={`${styles.productImage} ${styles.skeletonBlock}`} /><div className={styles.productInfo}><SkeletonBar /><SkeletonBar width="42%" /><SkeletonBar width="60%" /></div></div>)}</div>
    </section>
  );
}

function ArtisansSkeleton() {
  return (
    <section className={styles.homeSection} aria-label="Loading featured artisans" aria-busy="true">
      <div className={styles.skeletonHeading}><SkeletonBar width="185px" /></div>
      <div className={styles.artisanGrid}>{Array.from({ length: 4 }, (_, index) => <div className={`${styles.artisanCard} ${styles.skeletonCard}`} key={index}><span className={`${styles.avatar} ${styles.skeletonBlock}`} /><div className={styles.artisanInfo}><SkeletonBar /><SkeletonBar width="65%" /><SkeletonBar width="45%" /></div></div>)}</div>
    </section>
  );
}

export default function Home() {

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroImage} aria-label="Featured handcrafted collection"><span>Handcrafted collection image</span></div>
        <div className={styles.heroCopy}>
          <h1>Unique. Handmade.<br />Made with Heart.</h1>
          <p>Discover one-of-a-kind handcrafted treasures from talented artisans around the world.</p>
          <Link className={styles.primaryButton} href="/products">Shop Now</Link>
        </div>
      </section>

      <section className={styles.benefits} aria-label="Shopping benefits">
        {benefits.map((benefit) => <div className={styles.benefit} key={benefit.line1}><span className={styles.benefitIcon} aria-hidden="true">{benefit.icon}</span><p>{benefit.line1}<br />{benefit.line2}</p></div>)}
      </section>

      <Suspense fallback={<CategoriesSkeleton />}><CategoriesSection /></Suspense>
      <Suspense fallback={<ProductsSkeleton />}><FeaturedProductsSection /></Suspense>
      <Suspense fallback={<ArtisansSkeleton />}><FeaturedArtisansSection /></Suspense>

      <section className={styles.newsletter}>
        <span className={styles.mailIcon} aria-hidden="true">✉</span>
        <div className={styles.newsletterCopy}><h2>Join our newsletter</h2><p>Get updates on new arrivals, artisan stories, and exclusive offers.</p></div>
        <form className={styles.newsletterForm}><label className={styles.srOnly} htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Enter your email" /><button type="submit">Subscribe</button></form>
      </section>
    </main>
  );
}
