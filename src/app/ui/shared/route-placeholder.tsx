import Link from "next/link";
import { primaryRoutes } from "@/app/lib/routes";
import RouteLinks from "@/app/ui/shared/route-links";

type RoutePlaceholderProps = {
  title: string;
  description?: string;
};

export default function RoutePlaceholder({
  title,
  description = "This route is ready for manual design.",
}: RoutePlaceholderProps) {
  return (
    <main>
      <nav aria-label="Primary navigation">
        {primaryRoutes.map((route) => (
          <Link key={route.href} href={route.href}>
            {route.label}
          </Link>
        ))}
      </nav>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link href="/">View all prepared routes</Link>
      <RouteLinks />
    </main>
  );
}
