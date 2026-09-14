"use client";

import { Spinner } from "./Spinner";

export function BusyOverlay({ show, label }: { show: boolean; label: string }) {
  if (!show) return null;
  return (
    <div className="nav-loader" role="status" aria-live="polite">
      <div className="nav-progress"><i /></div>
      <div className="nav-loader-card">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  );
}
