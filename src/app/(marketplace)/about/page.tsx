import styles from "./page.module.css";

const values = [
  { icon: "♡", label: "Support Artisans" },
  { icon: "♧", label: "Sustainable Choices" },
  { icon: "☆", label: "Quality & Care" },
  { icon: "♙♙", label: "Community" },
];

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className={styles.imagePlaceholder} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <section className={styles.story}>
        <ImagePlaceholder label="Handcrafted artisan at work" />
        <div>
          <h1>About Handcrafted Haven</h1>
          <p>
            At Handcrafted Haven, we believe that quality and craftsmanship make
            all the difference. Our products are thoughtfully made to last,
            using sustainable materials and time-honored techniques.
          </p>
        </div>
      </section>

      <section className={styles.mission}>
        <div>
          <h2>Our Mission</h2>
          <p>
            To create beautiful, sustainable, and meaningful products that
            celebrate craftsmanship and empower artisans worldwide. We&apos;re
            committed to ethical practices and building a community that values
            authenticity.
          </p>
        </div>
        <ImagePlaceholder label="A collection of handcrafted products" />
      </section>

      <section className={styles.values} aria-label="Our values">
        {values.map((value) => (
          <article key={value.label}>
            <span aria-hidden="true">{value.icon}</span>
            <h3>{value.label}</h3>
          </article>
        ))}
      </section>
    </main>
  );
}
