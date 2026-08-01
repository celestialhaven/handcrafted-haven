type PopulatedCartProduct = {
  _id: { toString(): string };
  slug: string;
  name: string;
  price: number;
  images?: string[];
  availability: string;
  stock: number;
  artisan?: { displayName?: string; slug?: string };
};

type PopulatedCart = {
  items: Array<{
    _id: { toString(): string };
    product: PopulatedCartProduct | null;
    quantity: number;
  }>;
};

export function serializeCart(cart: PopulatedCart | null) {
  const items = (cart?.items ?? [])
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product!;
      return {
        id: item._id.toString(),
        productId: product._id.toString(),
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] ?? "",
        availability: product.availability,
        stock: product.stock,
        artisanName: product.artisan?.displayName ?? "Independent artisan",
        artisanSlug: product.artisan?.slug ?? "",
        quantity: item.quantity,
        lineTotal: Number((product.price * item.quantity).toFixed(2)),
      };
    });

  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping,
    total: Number((subtotal + shipping).toFixed(2)),
  };
}
