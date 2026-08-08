import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { requireArtisanSession } from "@/lib/auth";
import { Artisan, Order } from "@/models";
import styles from "../dashboard-pages.module.css";

type Props = { searchParams: Promise<{ status?: string }> };
type OrderView = { _id: { toString(): string }; orderNumber: string; status: string; createdAt: Date; user: { name?: string; email?: string }; items: { artisan: { toString(): string }; name: string; quantity: number; unitPrice: number }[] };

async function OrdersData({ status }: { status: string }) {
  const session = await requireArtisanSession(); await connectToDatabase();
  const artisan = await Artisan.findOne({ user: session.userId }).select("_id").lean();
  if (!artisan) return <p className={styles.empty}>No artisan profile found.</p>;
  const filter: Record<string, unknown> = { "items.artisan": artisan._id };
  if (["pending","paid","processing","shipped","completed","cancelled"].includes(status)) filter.status = status;
  const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 }).lean<OrderView[]>();
  return <div className={styles.table}><table><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Seller Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => { const items=order.items.filter(item=>item.artisan.toString()===artisan._id.toString()); const total=items.reduce((sum,item)=>sum+item.quantity*item.unitPrice,0); return <tr key={order._id.toString()}><td><strong>{order.orderNumber}</strong></td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td>{order.user?.name || order.user?.email || "Customer"}</td><td>{items.reduce((sum,item)=>sum+item.quantity,0)}</td><td>${total.toFixed(2)}</td><td><span className={styles.badge}>{order.status}</span></td></tr>;})}</tbody></table>{!orders.length&&<p className={styles.empty}>No orders match this filter.</p>}</div>;
}
export default async function OrdersPage({searchParams}:Props){const status=(await searchParams).status??"";return <main className={styles.page}><header className={styles.heading}><div><h1>Orders</h1><p>Track purchases containing your products.</p></div></header><form className={styles.toolbar}><select name="status" defaultValue={status}><option value="">All statuses</option>{["pending","paid","processing","shipped","completed","cancelled"].map(x=><option key={x}>{x}</option>)}</select><button>Apply Filter</button></form><Suspense key={status} fallback={<div className={styles.skeleton}/>}><OrdersData status={status}/></Suspense></main>}
