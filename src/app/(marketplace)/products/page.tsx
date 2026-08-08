import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, Product } from "@/models";
import ProductsCatalog, { type CatalogProduct } from "./products-catalog";
import styles from "./page.module.css";

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; query?: string; artisan?: string }>;
};

type ProductRecord = {
  _id: { toString(): string };
  slug: string;
  name: string;
  category: string;
  price: number;
  ratingAverage: number;
  ratingCount: number;
  images: string[];
  createdAt: Date;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function ProductsData({ selectedCategory, query, artisanSlug }: { selectedCategory?: string; query?: string; artisanSlug?: string }) {
  await connectToDatabase();
  const normalizedQuery = query?.trim() ?? "";
  const artisan = artisanSlug ? await Artisan.findOne({ slug: artisanSlug }).select("_id").lean() : null;
  const productFilter: Record<string, unknown> = normalizedQuery
    ? { status: "published", $or: [
        { name: { $regex: escapeRegex(normalizedQuery), $options: "i" } },
        { category: { $regex: escapeRegex(normalizedQuery), $options: "i" } },
        { description: { $regex: escapeRegex(normalizedQuery), $options: "i" } },
    ] }
    : { status: "published" };
  if (artisanSlug) productFilter.artisan = artisan?._id ?? null;
  const [records, categoryNames] = await Promise.all([
    Product.find(productFilter).select("slug name category price ratingAverage ratingCount images createdAt").sort({ createdAt: -1 }).lean<ProductRecord[]>(),
    Product.distinct<string>("category", { status: "published" }),
  ]);

  const products: CatalogProduct[] = records.map((product) => ({
    id: product._id.toString(),
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.ratingAverage,
    ratingCount: product.ratingCount,
    imageUrl: product.images?.[0] ?? "",
    createdAt: new Date(product.createdAt).toISOString(),
  }));
  const categories = categoryNames.sort();

  return <ProductsCatalog products={products} categories={categories} initialCategory={selectedCategory} query={normalizedQuery} />;
}

function CatalogSkeleton() {
  return (
    <main className={styles.catalog} aria-label="Loading products" aria-busy="true">
      <aside className={`${styles.filters} ${styles.catalogSkeleton}`}><span /><span /><span /><span /><span /></aside>
      <section className={styles.results}>
        <div className={`${styles.resultsHeader} ${styles.catalogSkeleton}`}><div><span /><span /></div></div>
        <div className={styles.productGrid}>
          {Array.from({ length: 8 }, (_, index) => <div className={`${styles.productCard} ${styles.skeletonCard}`} key={index}><div className={styles.productImage} /><div className={styles.productInfo}><span /><span /><span /></div></div>)}
        </div>
      </section>
    </main>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, query, artisan } = await searchParams;
  return <Suspense key={`${category ?? ""}:${query ?? ""}:${artisan ?? ""}`} fallback={<CatalogSkeleton />}><ProductsData selectedCategory={category} query={query} artisanSlug={artisan} /></Suspense>;
}
