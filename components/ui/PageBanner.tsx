import { ReactNode } from "react";

// Banner superior reutilizable para páginas internas.
export default function PageBanner({ title, accent, children }: { title: string; accent?: string; children?: ReactNode }) {
  return (
    <header className="page-banner">
      <div className="kiori-container">
        <h1>
          {title} {accent && <span className="italic-accent">{accent}</span>}
        </h1>
        {children && <p>{children}</p>}
      </div>
    </header>
  );
}
