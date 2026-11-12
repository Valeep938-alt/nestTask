"use client";

import Link from "next/link";

interface NavbarProps {
  brandName: string;
  brandSuffix: string;
  panelHref?: string;
  panelLabel?: string;
  userName?: string | null;
  onLogout?: () => void;
  rightExtra?: React.ReactNode;
}

export function Navbar({
  brandName,
  brandSuffix,
  panelHref,
  panelLabel,
  userName,
  onLogout,
  rightExtra,
}: NavbarProps) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span className="brand-dot" />
          {brandName} · {brandSuffix}
        </Link>

        <nav className="nav-center">
          {panelHref && panelLabel && (
            <Link href={panelHref} className="nav-link">
              {panelLabel}
            </Link>
          )}
        </nav>

        <div className="nav-right">
          {rightExtra}
          {userName ? (
            <>
              <span className="nav-user">{userName}</span>
              <button className="btn" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Acceder
              </Link>
              <Link className="btn" href="/registro">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
