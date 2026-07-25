import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
      <p>The requested page does not exist.</p>
      <Link href="/">Go Home</Link>
    </main>
  );
}
