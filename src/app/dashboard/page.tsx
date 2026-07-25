import Link from "next/link";
import styles from "./page.module.css";

const metrics = [
  { label: "Total Orders", value: "12" },
  { label: "Total Sales", value: "34" },
  { label: "Total Products", value: "10" },
  { label: "Total Reviews", value: "4.5 ★" },
  { label: "Earnings", value: "$680.00" },
];

const products = [
  { name: "Handmade Ceramic Mug", price: "$20.00", stock: 25, action: "Edit" },
  { name: "Wooden Cutting Board", price: "$35.00", stock: 18, action: "View" },
  { name: "Knitted Throw Blanket", price: "$60.00", stock: 12, action: "Copy" },
  { name: "Soy Candle Set", price: "$22.00", stock: 40, action: "Edit" },
  { name: "Handmade Soap Bundle", price: "$18.00", stock: 30, action: "View" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <div className={styles.pageHeading}>
        <h1>Dashboard</h1>
        <button type="button" aria-label="Search dashboard">
          <SearchIcon />
        </button>
      </div>

      <section className={styles.metrics} aria-label="Seller overview">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className={styles.recentProducts}>
        <div className={styles.sectionHeading}>
          <h2>Recent Products</h2>
          <Link href="/dashboard/products">
            View All Products <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name}>
                  <td>
                    <div className={styles.productImage} aria-label={`${product.name} image`} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <span className={styles.statusDot} /> In Stock
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <button type="button">
                      {product.action}
                      <span aria-hidden="true">⌄</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
