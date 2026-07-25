"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

const artisans = [
  { id: "maya-chen", name: "Maya Chen", location: "Portland, OR", rating: "4.9" },
  { id: "elias-brooks", name: "Elias Brooks", location: "Austin, TX", rating: "4.8" },
  { id: "sofia-reyes", name: "Sofia Reyes", location: "Santa Fe, NM", rating: "5.0" },
  { id: "noah-williams", name: "Noah Williams", location: "Asheville, NC", rating: "4.7" },
  { id: "amara-patel", name: "Amara Patel", location: "Seattle, WA", rating: "4.9" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

export default function ArtisansPage() {
  const [query, setQuery] = useState("");
  const filteredArtisans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return artisans;
    }

    return artisans.filter(
      (artisan) =>
        artisan.name.toLowerCase().includes(normalizedQuery) ||
        artisan.location.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <main className={styles.directory}>
      <header className={styles.intro}>
        <h1>Our Artisans</h1>
        <p>Discover and connect with talented artisans.</p>
      </header>

      <label className={styles.search}>
        <span className={styles.srOnly}>Search artisans</span>
        <input
          type="search"
          placeholder="Search artisans..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SearchIcon />
      </label>

      {filteredArtisans.length > 0 ? (
        <section className={styles.grid} aria-label="Artisan directory">
          {filteredArtisans.map((artisan) => (
            <article className={styles.card} key={artisan.id}>
              <div className={styles.avatar} aria-hidden="true" />
              <h2>{artisan.name}</h2>
              <p className={styles.location}>
                <LocationIcon />
                {artisan.location}
              </p>
              <p className={styles.rating} aria-label={`${artisan.rating} out of 5 stars`}>
                ★ <strong>{artisan.rating}</strong>
              </p>
              <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
            </article>
          ))}
        </section>
      ) : (
        <p className={styles.empty}>No artisans match your search.</p>
      )}
    </main>
  );
}
