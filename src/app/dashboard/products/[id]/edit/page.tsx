import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { requireArtisanSession } from "@/lib/auth";
import { Artisan, Product } from "@/models";
import EditProductForm from "./edit-product-form";
import styles from "../../create/page.module.css";

type EditProductPageProps = { params: Promise<{ id: string }> };
type ProductEdit = {
  slug: string; name: string; category: string; price: number; description: string;
  availability: "in-stock" | "made-to-order" | "out-of-stock";
  stock: number; status: "draft" | "published" | "archived"; featured: boolean;
};

async function ProductData({ slug }: { slug: string }) {
  const session = await requireArtisanSession();
  await connectToDatabase();
  const artisan = await Artisan.findOne({ user: session.userId }).select("_id").lean();
  if (!artisan) notFound();
  const product = await Product.findOne({ slug, artisan: artisan._id })
    .select("slug name category price description availability stock status featured")
    .lean<ProductEdit>();
  if (!product) notFound();
  return <EditProductForm product={product} />;
}

function EditSkeleton() {
  return <div aria-label="Loading product editor" aria-busy="true" style={{ minHeight: 500, borderRadius: 8, background: "#f0f0ed" }} />;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <main className={styles.createPage}><Suspense key={id} fallback={<EditSkeleton />}><ProductData slug={id} /></Suspense></main>;
}
