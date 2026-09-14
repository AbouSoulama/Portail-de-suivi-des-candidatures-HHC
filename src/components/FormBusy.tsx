"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "./Spinner";

export function FormBusy({ label }: { label: string }) {
  const { pending } = useFormStatus();
  if (!pending) return null;

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

export function SubmitButton({
  className,
  children,
  pendingLabel,
  dark = false,
}: {
  className: string;
  children: React.ReactNode;
  pendingLabel: string;
  dark?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? <><Spinner dark={dark} /> {pendingLabel}</> : children}
    </button>
  );
}
