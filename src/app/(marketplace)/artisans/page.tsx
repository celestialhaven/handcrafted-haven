import Link from "next/link";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan } from "@/models";
import styles from "./page.module.css";

type ArtisansPageProps = { searchParams: Promise<{ q?: string }> };
type ArtisanCard = {
  _id: { toString(): string };
  displayName: string;
  slug: string;
  location: string;
  ratingAverage: number;
};

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
}

function LocationIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
}

async function ArtisanDirectory({ query }: { query: string }) {
  await connectToDatabase();
  const filter = query ? { $text: { $search: query } } : {};
  const artisans = await Artisan.find(filter)
    .select("displayName slug location ratingAverage")
    .sort({ ratingAverage: -1, ratingCount: -1 })
    .limit(50)
    .lean<ArtisanCard[]>();

  if (!artisans.length) return <p className={styles.empty}>No artisans match your search.</p>;

  return (
    <section className={styles.grid} aria-label="Artisan directory">
      {artisans.map((artisan) => (
        <article className={styles.card} key={artisan._id.toString()}>
          <div className={styles.avatar} aria-hidden="true" />
          <h2>{artisan.displayName}</h2>
          <p className={styles.location}><LocationIcon />{artisan.location || "Location not provided"}</p>
          <p className={styles.rating} aria-label={`${artisan.ratingAverage} out of 5 stars`}>★ <strong>{artisan.ratingAverage.toFixed(1)}</strong></p>
          <Link href={`/artisans/${artisan.slug}`}>View Profile</Link>
        </article>
      ))}
    </section>
  );
}

function DirectorySkeleton() {
  return <section className={styles.grid} aria-label="Loading artisans" aria-busy="true">{Array.from({ length: 5 }, (_, index) => <article className={styles.card} key={index}><div className={styles.avatar} /><h2>Loading…</h2><p>Fetching artisan profile</p></article>)}</section>;
}

export default async function ArtisansPage({ searchParams }: ArtisansPageProps) {
  const query = (await searchParams).q?.trim() ?? "";
  return (
    <main className={styles.directory}>
      <header className={styles.intro}><h1>Our Artisans</h1><p>Discover and connect with talented artisans.</p></header>
      <form className={styles.search} action="/artisans">
        <label className={styles.srOnly} htmlFor="artisan-search">Search artisans</label>
        <input id="artisan-search" name="q" type="search" placeholder="Search artisans..." defaultValue={query} />
        <SearchIcon />
      </form>
      <Suspense key={query} fallback={<DirectorySkeleton />}><ArtisanDirectory query={query} /></Suspense>
    </main>
  );
}
