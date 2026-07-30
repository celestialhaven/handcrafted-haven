BEGIN;

-- Users table for buyers and artisans/sellers
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'artisan')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Artisan profiles linked to user accounts
CREATE TABLE artisans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT,
  bio TEXT,
  profile_image_url TEXT,
  rating_average NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products sold by artisans
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  artisan_id INTEGER NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('in-stock', 'made-to-order', 'out-of-stock')),
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customer reviews for products
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders placed by buyers
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artisan_id INTEGER REFERENCES artisans(id) ON DELETE SET NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')) DEFAULT 'pending',
  shipping_address TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order line items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);

-- Cart contents for active shoppers
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Starter seed data
INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Emma Brooks', 'emma.brooks@example.com', '$2b$10$examplehashplaceholder000000000000', 'buyer'),
  ('Maya Chen', 'maya.chen@example.com', '$2b$10$examplehashplaceholder000000000000', 'artisan'),
  ('Elias Brooks', 'elias.brooks@example.com', '$2b$10$examplehashplaceholder000000000000', 'artisan');

INSERT INTO artisans (user_id, display_name, slug, location, bio, profile_image_url, rating_average, rating_count)
VALUES
  (2, 'Maya Chen', 'maya-chen', 'Portland, OR', 'Ceramic artist specializing in functional pottery and home decor.', 'https://example.com/images/maya-chen.jpg', 4.9, 24),
  (3, 'Elias Brooks', 'elias-brooks', 'Austin, TX', 'Woodworker creating handmade serving boards and furniture accents.', 'https://example.com/images/elias-brooks.jpg', 4.8, 18);

INSERT INTO products (artisan_id, slug, name, category, price, availability, description, image_url, status)
VALUES
  (1, 'ceramic-mug', 'Ceramic Mug', 'Pottery', 32.00, 'in-stock', 'A handcrafted ceramic mug with a smooth glaze and comfortable handle.', 'https://example.com/images/ceramic-mug.jpg', 'published'),
  (1, 'clay-vase', 'Clay Vase', 'Pottery', 88.00, 'in-stock', 'A sculpted clay vase with organic texture and glaze finish.', 'https://example.com/images/clay-vase.jpg', 'published'),
  (2, 'woven-basket', 'Woven Basket', 'Home Decor', 58.00, 'made-to-order', 'Handwoven basket perfect for storage, styling, or gift wrapping.', 'https://example.com/images/woven-basket.jpg', 'published'),
  (2, 'hand-carved-board', 'Hand-Carved Serving Board', 'Woodwork', 75.00, 'in-stock', 'A solid wood serving board with hand-carved details and natural finish.', 'https://example.com/images/hand-carved-board.jpg', 'published'),
  (2, 'wooden-shelf', 'Wooden Wall Shelf', 'Woodwork', 120.00, 'out-of-stock', 'A floating wooden shelf with a minimalist design and durable finish.', 'https://example.com/images/wooden-shelf.jpg', 'published'),
  (2, 'custom-cutting-board', 'Custom Cutting Board', 'Woodwork', 65.00, 'made-to-order', 'Personalized cutting board crafted from premium hardwoods.', 'https://example.com/images/custom-cutting-board.jpg', 'published'),
  (2, 'live-edge-coffee-table', 'Live Edge Coffee Table', 'Woodwork', 450.00, 'made-to-order', 'A live edge coffee table showcasing the natural beauty of the wood grain.', 'https://example.com/images/live-edge-coffee-table.jpg', 'published'),
  (2, 'wooden-coat-rack', 'Wooden Coat Rack', 'Woodwork', 85.00, 'in-stock', 'A wall-mounted coat rack made from solid wood with a rustic finish.', 'https://example.com/images/wooden-coat-rack.jpg', 'published'),
  (2, 'handcrafted-wooden-chair', 'Handcrafted Wooden Chair', 'Woodwork', 250.00, 'made-to-order', 'A comfortable wooden chair with ergonomic design and handcrafted details.', 'https://example.com/images/handcrafted-wooden-chair.jpg', 'published'),
  (1, 'wooden-jewelry-box', 'Wooden Jewelry Box', 'Woodwork', 95.00, 'in-stock', 'A handcrafted wooden jewelry box with compartments and a polished finish.', 'https://example.com/images/wooden-jewelry-box.jpg', 'published'),
  (1, 'wooden-cutlery-set', 'Wooden Cutlery Set', 'Woodwork', 40.00, 'in-stock', 'A set of handcrafted wooden cutlery perfect for picnics and outdoor dining.', 'https://example.com/images/wooden-cutlery-set.jpg', 'published'),
  (1, 'wooden-plant-stand', 'Wooden Plant Stand', 'Woodwork', 70.00, 'made-to-order', 'A stylish wooden plant stand to elevate your indoor greenery.', 'https://example.com/images/wooden-plant-stand.jpg', 'published'),
  (1, 'wooden-bookends', 'Wooden Bookends', 'Woodwork', 55.00, 'in-stock', 'A pair of handcrafted wooden bookends to keep your books organized.', 'https://example.com/images/wooden-bookends.jpg', 'published'),
  (1, 'wooden-cutting-board-set', 'Wooden Cutting Board Set', 'Woodwork', 85.00, 'made-to-order', 'A set of handcrafted wooden cutting boards in various sizes.', 'https://example.com/images/wooden-cutting-board-set.jpg', 'published'),
  (2, 'wooden-coffee-table', 'Wooden Coffee Table', 'Woodwork', 350.00, 'in-stock', 'A solid wooden coffee table with a natural finish and sturdy construction.', 'https://example.com/images/wooden-coffee-table.jpg', 'published'),
  (1, 'wooden-dining-table', 'Wooden Dining Table', 'Woodwork', 600.00, 'made-to-order', 'A handcrafted wooden dining table perfect for family meals and gatherings.', 'https://example.com/images/wooden-dining-table.jpg', 'published'),
  (2, 'wooden-nightstand', 'Wooden Nightstand', 'Woodwork', 150.00, 'in-stock', 'A handcrafted wooden nightstand with drawers for storage.', 'https://example.com/images/wooden-nightstand.jpg', 'published')
  ;

INSERT INTO reviews (product_id, user_id, rating, title, comment)
VALUES
  (1, 1, 5, 'Beautiful mug', 'The ceramic mug feels great in hand and looks lovely on my kitchen shelf.'),
  (2, 1, 4, 'Lovely vase', 'Nice craftsmanship, though shipping took a little longer than expected.');

INSERT INTO orders (user_id, artisan_id, total_amount, status, shipping_address, payment_method)
VALUES
  (1, 1, 32.00, 'paid', '123 Main St, Portland, OR 97201', 'credit card');

INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
VALUES
  (1, 1, 1, 32.00, 32.00);

INSERT INTO cart_items (user_id, product_id, quantity)
VALUES
  (1, 3, 2);

COMMIT;
