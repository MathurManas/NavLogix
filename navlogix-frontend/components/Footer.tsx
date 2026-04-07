"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>NavLogix Systems © {new Date().getFullYear()}</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}
