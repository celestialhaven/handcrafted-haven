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

export default function CreateAccountPage() {
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

      <section className={styles.register}>
        <header>
          <h1>Create Account</h1>
          <h2>Join Handcrafted Haven</h2>
          <p>Fill out the details to get started</p>
        </header>

        <form>
          <div className={styles.field}>
            <label htmlFor="full-name">Full Name</label>
            <input
              id="full-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="register-password">Password</label>
            <div className={styles.passwordField}>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                minLength={8}
                required
              />
              <button type="button" aria-label="Show password">
                <EyeIcon />
              </button>
            </div>
          </div>

          <button className={styles.submitButton} type="submit">
            Register
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

        <p className={styles.signInPrompt}>
          Already have an account? <Link href="/sign-in">Sign In</Link>
        </p>
      </section>
    </main>
  );
}
