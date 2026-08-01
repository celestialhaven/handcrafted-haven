import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/mongodb";
import { Artisan, Cart, ContactMessage, NewsletterSubscriber, Order, Product, Review, User } from "../src/models";

const artisanSeeds = [
  ["Maya Chen", "maya-chen", "Portland, OR", "Ceramic artist specializing in functional pottery and home decor.", ["Pottery", "Home Decor"]],
  ["Elias Brooks", "elias-brooks", "Austin, TX", "Woodworker creating serving boards and furniture accents.", ["Woodwork"]],
  ["Sofia Reyes", "sofia-reyes", "Santa Fe, NM", "Jewelry maker inspired by desert colors and traditional metalwork.", ["Jewelry"]],
  ["Noah Williams", "noah-williams", "Asheville, NC", "Textile artist creating cozy, small-batch pieces for the home.", ["Textiles"]],
  ["Amara Patel", "amara-patel", "Seattle, WA", "Designer of useful, sustainably made everyday accessories.", ["Accessories"]],
] as const;

const productSeeds = [
  ["Ceramic Mug", "ceramic-mug", "Pottery", 32, 4.8, "maya-chen"],
  ["Woven Basket", "woven-basket", "Home Decor", 58, 4.9, "maya-chen"],
  ["Silver Pendant", "silver-pendant", "Jewelry", 75, 4.7, "sofia-reyes"],
  ["Linen Tote", "linen-tote", "Accessories", 42, 4.6, "amara-patel"],
  ["Woven Throw", "throw-blanket", "Textiles", 96, 5, "noah-williams"],
  ["Serving Board", "wood-serving-board", "Woodwork", 64, 4.8, "elias-brooks"],
  ["Clay Vase", "clay-vase", "Pottery", 88, 4.9, "maya-chen"],
  ["Beaded Earrings", "beaded-earrings", "Jewelry", 28, 4.5, "sofia-reyes"],
  ["Soy Candle", "soy-candle", "Home Decor", 24, 4.7, "maya-chen"],
  ["Embroidered Pouch", "embroidered-pouch", "Accessories", 36, 4.6, "amara-patel"],
  ["Table Runner", "table-runner", "Textiles", 48, 4.8, "noah-williams"],
  ["Artisan Gift Set", "artisan-gift-set", "More", 120, 5, "elias-brooks"],
] as const;

async function seed() {
  await connectToDatabase();
  await Promise.all([User, Artisan, Product, Review, Order, Cart, NewsletterSubscriber, ContactMessage].map((model) => model.deleteMany({})));
  const passwordHash = await bcrypt.hash("Handmade123!", 12);
  const buyer = await User.create({ name: "Emma Brooks", email: "emma.brooks@example.com", passwordHash, role: "buyer" });

  const artisanBySlug = new Map<string, { _id: mongoose.Types.ObjectId }>();
  for (const [name, slug, location, bio, specialties] of artisanSeeds) {
    const user = await User.create({ name, email: `${slug}@example.com`, passwordHash, role: "artisan" });
    const artisan = await Artisan.create({ user: user._id, displayName: name, slug, location, bio, specialties, ratingAverage: 4.8, ratingCount: 18 });
    artisanBySlug.set(slug, artisan);
  }

  const products = [];
  for (const [name, slug, category, price, ratingAverage, artisanSlug] of productSeeds) {
    products.push(await Product.create({
      artisan: artisanBySlug.get(artisanSlug)!._id,
      name, slug, category, price, ratingAverage,
      ratingCount: Math.round(ratingAverage * 3),
      description: `${name} is carefully handcrafted with quality materials and thoughtful details. Natural variations make every piece unique.`,
      availability: "in-stock", stock: 20, status: "published", featured: products.length < 5,
    }));
  }

  await Review.create({ product: products[0]._id, user: buyer._id, rating: 5, title: "Beautiful mug", comment: "It feels wonderful in hand and looks lovely in my kitchen.", verifiedPurchase: true });
  await Cart.create({ user: buyer._id, items: [{ product: products[1]._id, quantity: 2 }] });
  console.log(`Seeded ${artisanSeeds.length} artisans and ${products.length} products.`);
  console.log("Demo password for seeded users: Handmade123!");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
