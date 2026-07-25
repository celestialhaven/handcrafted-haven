import type { ReactNode } from "react";
import styles from "./auth-layout.module.css";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.authLayout} data-auth-layout>
      {children}
    </div>
  );
}
