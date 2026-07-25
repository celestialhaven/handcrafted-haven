export type AppRoute = {
  label: string;
  href: string;
};

export type RouteGroup = {
  label: string;
  routes: AppRoute[];
};

export const primaryRoutes: AppRoute[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Artisans", href: "/artisans" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const routeGroups: RouteGroup[] = [
  {
    label: "Marketplace",
    routes: [
      ...primaryRoutes,
      { label: "Product Detail Example", href: "/products/example-product" },
      { label: "Artisan Profile Example", href: "/artisans/example-artisan" },
      { label: "Shopping Cart", href: "/cart" },
    ],
  },
  {
    label: "Account",
    routes: [
      { label: "Sign In", href: "/sign-in" },
      { label: "Create Account", href: "/create-account" },
    ],
  },
  {
    label: "Seller Dashboard",
    routes: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Products", href: "/dashboard/products" },
      { label: "Create Product", href: "/dashboard/products/create" },
      {
        label: "Edit Product Example",
        href: "/dashboard/products/example-product/edit",
      },
      { label: "Orders", href: "/dashboard/orders" },
      { label: "Reviews", href: "/dashboard/reviews" },
      { label: "Earnings", href: "/dashboard/earnings" },
      { label: "Profile", href: "/dashboard/profile" },
      { label: "Settings", href: "/dashboard/settings" },
    ],
  },
];
