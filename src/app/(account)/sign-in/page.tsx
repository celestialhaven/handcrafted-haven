import Link from "next/link";
import styles from "./page.module.css";

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

export default function SignInPage() {
  return (
    <main className={styles.authCard}>
      <Link className={styles.brand} href="/" aria-label="Handcrafted Haven home">
        <span className={styles.brandMark} aria-hidden="true" />
        <strong>
          Handcrafted
          <br />
          Haven
        </strong>
      </Link>

      <section className={styles.signIn}>
        <header>
          <h1>Sign In</h1>
          <h2>Welcome back!</h2>
          <p>Enter your credentials to continue</p>
        </header>

        <form>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordField}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
              <button type="button" aria-label="Show password">
                <EyeIcon />
              </button>
            </div>
          </div>

          <div className={styles.formOptions}>
            <label className={styles.remember}>
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>

          <button className={styles.submitButton} type="submit">
            Sign In
          </button>
        </form>

        <div className={styles.divider}>
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className={styles.socials}>
          {socialOptions.map((option) => (
            <button type="button" aria-label={option.label} key={option.label}>
              {option.mark}
            </button>
          ))}
        </div>

        <p className={styles.registerPrompt}>
          Don&apos;t have an account?{" "}
          <Link href="/create-account">Register</Link>
        </p>
      </section>
    </main>
  );
}
