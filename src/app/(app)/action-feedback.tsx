"use client";

import { useSearchParams } from "next/navigation";

export function ActionFeedback() {
  const params = useSearchParams();

  if (params.get("created") === "1") {
    return <p className="notice floating-notice">Guardado. ATLAS ya lo tiene actualizado.</p>;
  }

  if (params.get("updated") === "1") {
    return <p className="notice floating-notice">Actualizado. Ya deberias verlo reflejado.</p>;
  }

  if (params.get("deleted") === "1") {
    return <p className="notice floating-notice">Borrado. ATLAS ha quitado ese registro.</p>;
  }

  if (params.get("uploaded") === "1") {
    return <p className="notice floating-notice">Archivo subido correctamente.</p>;
  }

  return null;
}
