import Link from "next/link";
import styles from "./page.module.css";

const benefits = [
  { icon: "♡", line1: "Handmade", line2: "with Care" },
  { icon: "♙♙", line1: "Support", line2: "Artisans" },
  { icon: "♧", line1: "Sustainable", line2: "Choices" },
  { icon: "♢", line1: "Secure", line2: "Shopping" },
];

const categories = [
  { icon: "⌂", label: "Home Decor" },
  { icon: "♢", label: "Jewelry" },
  { icon: "♧", label: "Accessories" },
  { icon: "▧", label: "Textiles" },
  { icon: "◉", label: "Pottery" },
  { icon: "•••", label: "More" },
];

const products = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  name: "Product Name",
  price: "$00.00",
}));

const artisans = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  name: "Artisan Name",
  location: "Location",
}));

function SectionHeading({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <h2>{children}</h2>
      <Link href={href}>View all</Link>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroImage} aria-label="Featured handcrafted collection">
          <span>Handcrafted collection image</span>
        </div>
        <div className={styles.heroCopy}>
          <h1>
            Unique. Handmade.
            <br />
            Made with Heart.
          </h1>
          <p>
            Discover one-of-a-kind handcrafted treasures from talented artisans
            around the world.
          </p>
          <Link className={styles.primaryButton} href="/products">
            Shop Now
          </Link>
        </div>
      </section>

      <section className={styles.benefits} aria-label="Shopping benefits">
        {benefits.map((benefit) => (
          <div className={styles.benefit} key={benefit.line1}>
            <span className={styles.benefitIcon} aria-hidden="true">
              {benefit.icon}
            </span>
            <p>
              {benefit.line1}
              <br />
              {benefit.line2}
            </p>
          </div>
        ))}
      </section>

      <section className={styles.homeSection}>
        <SectionHeading href="/products">Shop by Category</SectionHeading>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link className={styles.categoryCard} href="/products" key={category.label}>
              <span aria-hidden="true">{category.icon}</span>
              <strong>{category.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.homeSection}>
        <SectionHeading href="/products">Featured Products</SectionHeading>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <Link className={styles.productCard} href={`/products/${product.id}`} key={product.id}>
              <div className={styles.productImage}>
                <span>Product image</span>
              </div>
              <div className={styles.productInfo}>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
                <p aria-label="4 out of 5 stars">★★★★☆ <small>(12)</small></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.homeSection}>
        <SectionHeading href="/artisans">Featured Artisans</SectionHeading>
        <div className={styles.artisanGrid}>
          {artisans.map((artisan) => (
            <article className={styles.artisanCard} key={artisan.id}>
              <div className={styles.avatar} aria-hidden="true" />
              <div className={styles.artisanInfo}>
                <strong>{artisan.name}</strong>
                <span>{artisan.location}</span>
                <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.newsletter}>
        <span className={styles.mailIcon} aria-hidden="true">✉</span>
        <div className={styles.newsletterCopy}>
          <h2>Join our newsletter</h2>
          <p>Get updates on new arrivals, artisan stories, and exclusive offers.</p>
        </div>
        <form className={styles.newsletterForm}>
          <label className={styles.srOnly} htmlFor="newsletter-email">
            Email address
          </label>
          <input id="newsletter-email" type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </main>
  );
}
