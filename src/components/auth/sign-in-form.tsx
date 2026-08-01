"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(account)/sign-in/page.module.css";

type AccountType = "buyer" | "artisan";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

const socialOptions = [
  { label: "Continue with Google", mark: "G" },
  { label: "Continue with Facebook", mark: "f" },
  { label: "Continue with Apple", mark: "●" },
];

export default function SignInForm({ accountType }: { accountType: AccountType }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const artisan = accountType === "artisan";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          remember: data.get("remember") === "on",
          accountType,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.push(result.redirectTo);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.authCard}>
      <Link className={styles.brand} href="/" aria-label="Handcrafted Haven home">
        <span className={styles.brandMark} aria-hidden="true" />
        <strong>Handcrafted<br />Haven</strong>
      </Link>

      <section className={styles.signIn}>
        <header>
          <h1>{artisan ? "Artisan Sign In" : "Customer Sign In"}</h1>
          <h2>{artisan ? "Welcome back, maker!" : "Welcome back!"}</h2>
          <p>{artisan ? "Manage your products, orders, and shop" : "Sign in to shop and manage your cart"}</p>
        </header>

        <div className={styles.accountSwitch}>
          <Link className={!artisan ? styles.selectedAccount : undefined} href="/sign-in">Customer</Link>
          <Link className={artisan ? styles.selectedAccount : undefined} href="/artisan/sign-in">Artisan</Link>
        </div>

        <form action="/api/auth/login" method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="accountType" value={accountType} />
          <div className={styles.field}>
            <label htmlFor={`${accountType}-email`}>Email</label>
            <input id={`${accountType}-email`} name="email" type="email" autoComplete="email" placeholder="Enter your email" required />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${accountType}-password`}>Password</label>
            <div className={styles.passwordField}>
              <input id={`${accountType}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}><EyeIcon /></button>
            </div>
          </div>
          <div className={styles.formOptions}>
            <label className={styles.remember}><input type="checkbox" name="remember" /><span>Remember me for 14 days</span></label>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
          <button className={styles.submitButton} type="submit" disabled={submitting}>{submitting ? "Signing In..." : `Sign In as ${artisan ? "Artisan" : "Customer"}`}</button>
          {status && <p className={styles.error} role="alert">{status}</p>}
        </form>

        {!artisan && <><div className={styles.divider}><span /><p>or continue with</p><span /></div><div className={styles.socials}>{socialOptions.map((option) => <button type="button" aria-label={option.label} key={option.label}>{option.mark}</button>)}</div></>}
        <p className={styles.registerPrompt}>{artisan ? <>Need an artisan account? <Link href="/contact">Contact Us to Apply</Link></> : <>Don&apos;t have an account? <Link href="/create-account">Register</Link></>}</p>
      </section>
    </main>
  );
}
