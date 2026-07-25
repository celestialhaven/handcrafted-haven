import RoutePlaceholder from "@/app/ui/shared/route-placeholder";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  return <RoutePlaceholder title={`Edit Product: ${id}`} />;
}
