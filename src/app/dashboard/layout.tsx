import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./dashboard-layout.module.css";

const dashboardLinks = [
  { icon: "▦", label: "Dashboard", href: "/dashboard" },
  { icon: "◇", label: "Products", href: "/dashboard/products" },
  { icon: "▣", label: "Orders", href: "/dashboard/orders" },
  { icon: "☆", label: "Reviews", href: "/dashboard/reviews" },
  { icon: "▥", label: "Earnings", href: "/dashboard/earnings" },
  { icon: "♙", label: "Profile", href: "/dashboard/profile" },
  { icon: "⚙", label: "Settings", href: "/dashboard/settings" },
];

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.dashboardShell} data-dashboard-layout>
      <header className={styles.dashboardHeader}>
        <Link className={styles.brand} href="/" aria-label="Handcrafted Haven home">
          <span className={styles.brandMark} aria-hidden="true" />
          <strong>
            Handcrafted
            <br />
            Haven
          </strong>
        </Link>
        <button className={styles.menuButton} type="button" aria-label="Toggle sidebar">
          <span />
          <span />
          <span />
        </button>
        <div className={styles.headerActions}>
          <Link href="/dashboard/profile" aria-label="Seller profile">
            <AccountIcon />
          </Link>
          <Link href="/cart" aria-label="Shopping cart">
            <CartIcon />
          </Link>
        </div>
      </header>

      <aside className={styles.sidebar}>
        <nav aria-label="Seller dashboard">
          {dashboardLinks.map((link, index) => (
            <Link
              className={index === 0 ? styles.active : undefined}
              href={link.href}
              key={link.href}
            >
              <span aria-hidden="true">{link.icon}</span>
              <strong>{link.label}</strong>
            </Link>
          ))}
          <Link className={styles.logout} href="/sign-in">
            <span aria-hidden="true">↪</span>
            <strong>Logout</strong>
          </Link>
        </nav>
      </aside>

      <div className={styles.dashboardContent}>{children}</div>
    </div>
  );
}
