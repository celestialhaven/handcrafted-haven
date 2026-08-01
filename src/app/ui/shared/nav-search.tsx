"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./site-chrome.module.css";

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
}

export default function NavSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentQuery = pathname === "/products" ? searchParams.get("query") ?? "" : "";
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, []);

  function handleSearch(term: string) {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(pathname === "/products" ? searchParams.toString() : "");
      if (term.trim()) params.set("query", term.trim());
      else params.delete("query");
      const target = `/products${params.size ? `?${params.toString()}` : ""}`;
      router.replace(target);
    }, 350);
  }

  return (
    <label className={styles.navSearch}>
      <span className={styles.srOnly}>Search products</span>
      <SearchIcon />
      <input key={`${pathname}:${currentQuery}`} type="search" defaultValue={currentQuery} placeholder="Search products…" onChange={(event) => handleSearch(event.target.value)} />
    </label>
  );
}
