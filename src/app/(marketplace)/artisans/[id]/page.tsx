import Link from "next/link";
import FollowButton from "./follow-button";
import styles from "./page.module.css";

type ArtisanPageProps = {
  params: Promise<{ id: string }>;
};

const artisanProfiles: Record<string, { name: string; location: string }> = {
  "maya-chen": { name: "Maya Chen", location: "Portland, OR" },
  "elias-brooks": { name: "Elias Brooks", location: "Austin, TX" },
  "sofia-reyes": { name: "Sofia Reyes", location: "Santa Fe, NM" },
  "noah-williams": { name: "Noah Williams", location: "Asheville, NC" },
  "amara-patel": { name: "Amara Patel", location: "Seattle, WA" },
  "artisan-name": { name: "Artisan Name", location: "Portland, OR" },
};

const products = [
  { id: "ceramic-mug", name: "Ceramic Mug", price: "$32.00" },
  { id: "woven-basket", name: "Woven Basket", price: "$58.00" },
  { id: "linen-tote", name: "Linen Tote", price: "$42.00" },
  { id: "clay-vase", name: "Clay Vase", price: "$88.00" },
];

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function formatName(id: string) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ArtisanPage({ params }: ArtisanPageProps) {
  const { id } = await params;
  const artisan = artisanProfiles[id] ?? {
    name: formatName(id),
    location: "Portland, OR",
  };

  return (
    <main className={styles.profilePage}>
      <div className={styles.cover} role="img" aria-label={`${artisan.name} studio cover image`} />

      <section className={styles.profileIntro}>
        <div className={styles.avatar} role="img" aria-label={`${artisan.name} profile image`} />
        <div className={styles.biography}>
          <div className={styles.nameRow}>
            <div>
              <h1>{artisan.name}</h1>
              <p className={styles.location}>
                <LocationIcon />
                {artisan.location}
              </p>
            </div>
            <FollowButton />
          </div>
          <p className={styles.bio}>
            Passionate artisan creating meaningful, ethically made handcrafted
            pieces inspired by tradition and nature. Each creation is carefully
            crafted with love and attention to detail, bringing beauty and
            authenticity into everyday life.
          </p>
        </div>
      </section>

      <section className={styles.profileContent}>
        <div className={styles.tabs} role="tablist" aria-label="Artisan profile sections">
          <button className={styles.activeTab} type="button" role="tab" aria-selected="true">
            Products
          </button>
          <button type="button" role="tab" aria-selected="false">About</button>
          <button type="button" role="tab" aria-selected="false">Stories</button>
          <button type="button" role="tab" aria-selected="false">Reviews</button>
          <button type="button" role="tab" aria-selected="false">Policies</button>
        </div>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <Link className={styles.productCard} href={`/products/${product.id}`} key={product.id}>
              <div className={styles.productImage} role="img" aria-label={`${product.name} image`} />
              <div>
                <h2>{product.name}</h2>
                <strong>{product.price}</strong>
                <p aria-label="4 out of 5 stars">★★★★☆ <span>(0)</span></p>
              </div>
            </Link>
          ))}
        </div>

        <Link className={styles.viewAll} href="/products">
          View All Products
        </Link>
      </section>
    </main>
  );
}
