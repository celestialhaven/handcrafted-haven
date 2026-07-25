import Link from "next/link";
import { primaryRoutes } from "@/app/lib/routes";
import styles from "./site-chrome.module.css";

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20v-1.5A6.5 6.5 0 0 1 12 12a6.5 6.5 0 0 1 6.5 6.5V20z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l1.8 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.5L20 8H6" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

function Brand() {
  return (
    <Link className={styles.brand} href="/" aria-label="Handcrafted Haven home">
      <span className={styles.brandMark} aria-hidden="true">
        <span>H</span>
      </span>
      <span className={styles.brandName}>
        Handcrafted
        <br />
        Haven
      </span>
    </Link>
  );
}

function Navigation() {
  return (
    <>
      {primaryRoutes.map((route) => (
        <Link key={route.href} href={route.href}>
          {route.label}
        </Link>
      ))}
    </>
  );
}

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Brand />

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <Navigation />
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.iconLink} href="/sign-in" aria-label="Account">
            <AccountIcon />
          </Link>
          <Link className={styles.cartLink} href="/cart" aria-label="Cart, 2 items">
            <CartIcon />
            <span className={styles.cartCount}>2</span>
          </Link>
          <details className={styles.mobileMenu}>
            <summary aria-label="Open navigation">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <Navigation />
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
