import styles from "./page.module.css";

function ContactIcon({ type }: { type: "email" | "phone" | "location" | "hours" }) {
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3 4.5 4.5c-1.7 1.7.7 6.9 4.3 10.5s8.8 6 10.5 4.3L21 17l-5-3-1.7 2c-1.8-.8-5.5-4.5-6.3-6.3L10 8z" />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

const contactDetails = [
  {
    type: "email" as const,
    title: "Email",
    lines: ["hello@handcraftedhaven.com"],
  },
  {
    type: "phone" as const,
    title: "Phone",
    lines: ["+1 (555) 123-4567"],
  },
  {
    type: "location" as const,
    title: "Location",
    lines: ["123 Artisan Way", "Portland, OR 97201"],
  },
  {
    type: "hours" as const,
    title: "Business Hours",
    lines: ["Mon – Fri: 9am – 5pm PST", "Sat – Sun: Closed"],
  },
];

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <section className={styles.contactInfo}>
        <header>
          <h1>Contact Us</h1>
          <p>We&apos;d love to hear from you.</p>
        </header>

        <div className={styles.detailList}>
          {contactDetails.map((detail) => (
            <article key={detail.title}>
              <div className={styles.iconBox}>
                <ContactIcon type={detail.type} />
              </div>
              <div>
                <h2>{detail.title}</h2>
                {detail.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.messagePanel}>
        <h2>Send us a message</h2>
        <form>
          <div className={styles.field}>
            <label htmlFor="contact-name">Name *</label>
            <input id="contact-name" name="name" type="text" placeholder="Enter your name" required />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-subject">Subject</label>
            <select id="contact-subject" name="subject" defaultValue="">
              <option value="" disabled>
                Select a subject
              </option>
              <option value="order">Order question</option>
              <option value="product">Product question</option>
              <option value="artisan">Artisan inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Write your message..."
              rows={5}
              required
            />
          </div>

          <button className={styles.submitButton} type="submit">
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
