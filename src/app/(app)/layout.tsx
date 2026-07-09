import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ActionFeedback } from "./action-feedback";

const navItems: Array<[string, string]> = [
  ["Hoy", "/"],
  ["Proyectos", "/projects"],
  ["Clientes", "/clients"],
  ["Dinero", "/money"],
  ["Calendario", "/calendar"],
  ["Studio", "/studio"]
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
        <details className="new-menu">
          <summary>+ Nuevo</summary>
          <Link href="/new?type=task">Tarea</Link>
          <Link href="/new?type=money">Gasto / cobro</Link>
          <Link href="/new?type=document-upload">Subir documento</Link>
          <Link href="/new?type=client">Cliente / lead</Link>
          <Link href="/new?type=meeting">Reunion</Link>
          <span className="menu-divider">Mas opciones</span>
          <Link href="/new?type=project">Proyecto</Link>
          <Link href="/new?type=decision">Decision</Link>
          <Link href="/new?type=template-upload">Subir plantilla</Link>
          <Link href="/new?type=supplier">Proveedor</Link>
          <Link href="/new?type=note">Nota</Link>
          <Link href="/new?type=goal">Objetivo</Link>
          <Link href="/new?type=automation">Automatizacion</Link>
        </details>
        <nav className="nav">
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <form action="/api/logout" method="post" className="logout-form">
          <button type="submit">Cerrar sesion</button>
        </form>
      </aside>
      <main className="main">
        <Suspense fallback={null}>
          <ActionFeedback />
        </Suspense>
        {children}
      </main>
      <nav className="mobile-dock">
        <Link href="/">Hoy</Link>
        <Link href="/new?type=task">+ Nuevo</Link>
        <Link href="/new?type=document-upload">Subir</Link>
        <Link href="/projects">Proyectos</Link>
      </nav>
    </div>
  );
}
