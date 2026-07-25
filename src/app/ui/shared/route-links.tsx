import Link from "next/link";
import { routeGroups } from "@/app/lib/routes";

type RouteLinksProps = {
  headingLevel?: "h1" | "h2";
};

export default function RouteLinks({
  headingLevel = "h2",
}: RouteLinksProps) {
  const Heading = headingLevel;

  return (
    <nav aria-label="Prepared pages">
      {routeGroups.map((group) => (
        <section key={group.label}>
          <Heading>{group.label}</Heading>
          <ul>
            {group.routes.map((route) => (
              <li key={`${group.label}-${route.href}`}>
                <Link href={route.href}>{route.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
