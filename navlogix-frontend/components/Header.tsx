"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header({ isTransparent = false }: { isTransparent?: boolean }) {
  const { user } = useAuth();

  return (
    <header className="header" style={isTransparent ? { boxShadow: 'none' } : {}}>
      <div className="container header-inner">
        <Link href="/" className="logo">
          <div className="logo-pin"></div>
          <div className="logo-text">NavLogix Platform</div>
        </Link>
        
        {user && (
          <nav className="header-nav" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/about">About Us</Link>
            <Link href="#">Solutions</Link>
            <Link href="/documentation">Documentation</Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.email || 'Google User'}</span>
              <button 
                onClick={() => signOut(auth)} 
                style={{
                  background: 'white', 
                  color: 'var(--google-blue)', 
                  border: '1px solid var(--border)', 
                  padding: '6px 14px', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  fontFamily: "'Google Sans', sans-serif", 
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                Sign out
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
