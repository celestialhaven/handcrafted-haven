import Link from "next/link";
import styles from "./not-found.module.css";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 11 9-8 9 8" />
      <path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <section className={styles.content}>
        <p className={styles.code}>404</p>
        <h1>Page Not Found</h1>
        <p className={styles.message}>
          The page you are looking for doesn&apos;t exist
          <br />
          or has been moved.
        </p>
        <Link className={styles.homeButton} href="/">
          <HomeIcon />
          Go Home
        </Link>
      </section>

      <div className={styles.illustration} role="img" aria-label="Page not found illustration">
        <span>Page not found illustration</span>
      </div>
    </main>
  );
}
