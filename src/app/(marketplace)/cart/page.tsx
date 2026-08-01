import Link from "next/link";
import { getSession } from "@/lib/auth";
import CartClient from "./cart-client";
import styles from "./page.module.css";

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className={styles.cartPage}>
        <section className={styles.signInCard}>
          <h1>Your Shopping Cart</h1>
          <p>Sign in to add handmade products and keep your cart synced.</p>
          <Link href="/sign-in?next=/cart">Sign In</Link>
        </section>
      </main>
    );
  }

  return <CartClient />;
}
