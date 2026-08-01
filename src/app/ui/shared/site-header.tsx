import Link from "next/link";
import { primaryRoutes } from "@/app/lib/routes";
import CartLink from "./cart-link";
import LogoutButton from "./logout-button";
import { getSession } from "@/lib/auth";
import NavSearch from "./nav-search";
import styles from "./site-chrome.module.css";

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20v-1.5A6.5 6.5 0 0 1 12 12a6.5 6.5 0 0 1 6.5 6.5V20z" />
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

export default async function SiteHeader() {
  const session = await getSession();
  const accountHref = session?.role === "artisan" || session?.role === "admin" ? "/dashboard" : session ? "/" : "/sign-in";
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Brand />

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <Navigation />
        </nav>

        <div className={styles.headerActions}>
          <NavSearch />
          <Link className={styles.iconLink} href={accountHref} aria-label={session ? `Account: ${session.name}` : "Sign in"}>
            <AccountIcon />
          </Link>
          {session && <LogoutButton className={styles.headerLogout} redirectTo={session.role === "artisan" || session.role === "admin" ? "/artisan/sign-in" : "/sign-in"}>Logout</LogoutButton>}
          <CartLink />
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
