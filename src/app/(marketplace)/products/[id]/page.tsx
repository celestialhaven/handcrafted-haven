import RoutePlaceholder from "@/app/ui/shared/route-placeholder";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return <RoutePlaceholder title={`Product: ${id}`} />;
}
