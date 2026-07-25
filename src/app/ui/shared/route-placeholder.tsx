type RoutePlaceholderProps = {
  title: string;
  description?: string;
};

export default function RoutePlaceholder({
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <main style={{ width: "min(100% - 48px, 1200px)", margin: "0 auto", padding: "48px 0" }}>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </main>
  );
}
