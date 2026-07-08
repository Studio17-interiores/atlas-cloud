import Link from "next/link";
import type { ReactNode } from "react";

const navItems: Array<[string, string]> = [
  ["Hoy", "/"],
  ["Semana", "/week"],
  ["Calendario", "/calendar"],
  ["Seguimientos", "/followups"],
  ["Proyectos", "/projects"],
  ["Clientes", "/clients"],
  ["Dinero", "/money"],
  ["Objetivos", "/growth"],
  ["Estudio", "/studio"],
  ["Plantillas", "/templates"],
  ["Sistema", "/system"]
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="mark">A</div>
          <div>
            <strong>ATLAS</strong>
            <div className="muted">Studio 17 Cloud</div>
          </div>
        </div>
        <nav className="nav">
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
