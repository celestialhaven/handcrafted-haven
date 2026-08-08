import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, Product } from "@/models";
import FollowButton from "./follow-button";
import styles from "./page.module.css";

type ArtisanPageProps = { params: Promise<{ id: string }> };
type ArtisanView = { _id: unknown; displayName: string; location: string; bio: string };
type ProductView = { _id: { toString(): string }; slug: string; name: string; price: number; ratingAverage: number; ratingCount: number };

function LocationIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
}

async function ArtisanProfile({ slug }: { slug: string }) {
  await connectToDatabase();
  const artisan = await Artisan.findOne({ slug }).select("displayName location bio").lean<ArtisanView>();
  if (!artisan) notFound();
  const products = await Product.find({ artisan: artisan._id, status: "published" })
    .select("slug name price ratingAverage ratingCount")
    .sort({ createdAt: -1 }).lean<ProductView[]>();

  return <>
    <div className={styles.cover} role="img" aria-label={`${artisan.displayName} studio cover image`} />
    <section className={styles.profileIntro}>
      <div className={styles.avatar} role="img" aria-label={`${artisan.displayName} profile image`} />
      <div className={styles.biography}><div className={styles.nameRow}><div><h1>{artisan.displayName}</h1><p className={styles.location}><LocationIcon />{artisan.location || "Location not provided"}</p></div><FollowButton /></div><p className={styles.bio}>{artisan.bio || "This artisan has not added a biography yet."}</p></div>
    </section>
    <section className={styles.profileContent}>
      <div className={styles.tabs} role="tablist" aria-label="Artisan profile sections"><button className={styles.activeTab} type="button" role="tab" aria-selected="true">Products</button><button type="button" role="tab" aria-selected="false">About</button><button type="button" role="tab" aria-selected="false">Stories</button><button type="button" role="tab" aria-selected="false">Reviews</button><button type="button" role="tab" aria-selected="false">Policies</button></div>
      {products.length ? <div className={styles.productGrid}>{products.map((product) => <Link className={styles.productCard} href={`/products/${product.slug}`} key={product._id.toString()}><div className={styles.productImage} role="img" aria-label={`${product.name} image`} /><div><h2>{product.name}</h2><strong>${product.price.toFixed(2)}</strong><p aria-label={`${product.ratingAverage} out of 5 stars`}>★ {product.ratingAverage.toFixed(1)} <span>({product.ratingCount})</span></p></div></Link>)}</div> : <p>No published products yet.</p>}
      <Link className={styles.viewAll} href={`/products?artisan=${slug}`}>View All Products</Link>
    </section>
  </>;
}

function ProfileSkeleton() {
  return <div aria-label="Loading artisan profile" aria-busy="true"><div className={styles.cover} /><section className={styles.profileIntro}><div className={styles.avatar} /><div className={styles.biography}><h1>Loading artisan…</h1><p>Fetching profile and products.</p></div></section></div>;
}

export default async function ArtisanPage({ params }: ArtisanPageProps) {
  const { id } = await params;
  return <main className={styles.profilePage}><Suspense key={id} fallback={<ProfileSkeleton />}><ArtisanProfile slug={id} /></Suspense></main>;
}
