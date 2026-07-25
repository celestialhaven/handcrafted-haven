import RoutePlaceholder from "@/app/ui/shared/route-placeholder";

type ArtisanPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArtisanPage({ params }: ArtisanPageProps) {
  const { id } = await params;

  return <RoutePlaceholder title={`Artisan: ${id}`} />;
}
